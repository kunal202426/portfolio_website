import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useTheme } from '../providers/ThemeProvider'

import resumePdfUrl from '/Resume_general.pdf?url'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfFile, setPdfFile] = useState<string | Blob>(resumePdfUrl)
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'custom'>('width')

  // Lock all scrolling while modal is open (body + Lenis)
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop()
    return () => {
      document.body.style.overflow = prevOverflow
      window.lenis?.start()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrentPage((p) => Math.max(1, p - 1))
      if (e.key === 'ArrowRight') setCurrentPage((p) => Math.min(totalPages, p + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, totalPages])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadError = () => {
    setIsLoading(false)
    if (typeof pdfFile === 'string') {
      fetch(resumePdfUrl)
        .then((r) => { if (!r.ok) throw new Error(); return r.blob() })
        .then((blob) => { setPdfFile(blob); setIsLoading(true) })
        .catch(() => {})
    }
  }

  const getPageWidth = () => {
    const inset = window.innerWidth >= 768 ? 64 : 32
    const modalWidth = window.innerWidth - inset * 2
    const modalHeight = window.innerHeight - inset * 2
    const bodyHeight = modalHeight - 120

    switch (fitMode) {
      case 'width':  return Math.max(300, modalWidth - 48)
      case 'height': return Math.max(300, Math.floor(bodyHeight * 0.707))
      case 'custom': return Math.max(200, Math.floor((modalWidth - 48) * (zoom / 100)))
      default:       return Math.max(300, modalWidth - 48)
    }
  }

  // Theme colors
  const bg       = isDark ? 'var(--bg-card)' : '#FFFBF5'
  const bgHeader = isDark ? 'var(--bg-primary)' : '#F0EBE0'
  const bgBody   = isDark ? '#111109' : '#F5F0E8'
  const textPri  = isDark ? '#F0EBE0' : '#1A1208'
  const textSec  = isDark ? '#9B8B70' : '#6B5C44'
  const border   = isDark ? 'rgba(212,165,116,0.2)' : 'rgba(212,165,116,0.35)'
  const btnHover = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  const btnStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    color: textSec,
    transition: 'background 150ms',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 40 }}
          />

          {/* Modal - full-screen on mobile, inset on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="resume-modal-panel"
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0, left: 0,
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              background: bg,
              border: `1.5px solid ${border}`,
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.7)'
                : '0 32px 80px rgba(26,18,8,0.25)',
              overflow: 'hidden',
              borderRadius: 0,
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: `1px solid ${border}`,
              background: bgHeader,
              flexShrink: 0,
              gap: '8px',
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: 'monospace', fontSize: '13px', color: textPri, fontWeight: 600 }}>
                  Resume_general.pdf
                </p>
                <p style={{ fontSize: '11px', color: textSec, marginTop: '2px' }}>
                  {totalPages > 0 ? `Page ${currentPage} / ${totalPages}` : 'Loading…'}
                  {fitMode === 'custom' ? ` • ${zoom}%` : ` • Fit ${fitMode}`}
                </p>
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {/* Zoom */}
                <button style={btnStyle} onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => { setZoom(Math.max(50, zoom - 10)); setFitMode('custom') }} title="Zoom out">−</button>
                <span style={{ fontSize: '11px', color: textSec, width: '36px', textAlign: 'center' }}>{zoom}%</span>
                <button style={btnStyle} onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => { setZoom(Math.min(300, zoom + 10)); setFitMode('custom') }} title="Zoom in">+</button>

                <div style={{ width: '1px', height: '16px', background: border, margin: '0 4px' }} />

                {/* Fit modes */}
                {(['width', 'height'] as const).map((mode) => (
                  <button key={mode} style={{
                    ...btnStyle,
                    fontSize: '11px',
                    padding: '4px 8px',
                    background: fitMode === mode ? 'var(--accent-primary)' : 'transparent',
                    color: fitMode === mode ? '#fff' : textSec,
                  }}
                    onMouseEnter={e => { if (fitMode !== mode) e.currentTarget.style.background = btnHover }}
                    onMouseLeave={e => { if (fitMode !== mode) e.currentTarget.style.background = 'transparent' }}
                    onClick={() => setFitMode(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
                <button style={{ ...btnStyle, fontSize: '11px', padding: '4px 8px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => { setZoom(100); setFitMode('width') }}>Reset</button>

                <div style={{ width: '1px', height: '16px', background: border, margin: '0 4px' }} />

                {/* Download */}
                <button style={btnStyle} title="Open PDF"
                  onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => window.open(resumePdfUrl, '_blank')}>
                  <Download size={16} style={{ color: 'var(--accent-primary)', display: 'block' }} />
                </button>

                {/* Close - always visible, orange-accented */}
                <button
                  onClick={onClose}
                  title="Close"
                  style={{
                    ...btnStyle,
                    marginLeft: '4px',
                    background: 'rgba(var(--accent-primary-rgb),0.12)',
                    border: '1px solid rgba(var(--accent-primary-rgb),0.35)',
                    color: 'var(--accent-primary)',
                    padding: '6px',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.12)')}
                >
                  <X size={16} style={{ display: 'block' }} />
                </button>
              </div>
            </div>

            {/* Body - scrollable PDF */}
            {/* data-lenis-prevent tells Lenis to skip wheel events inside this element */}
            <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', minHeight: 0, background: bgBody, overscrollBehavior: 'contain' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 16px 32px' }}>
                <div style={{ position: 'relative' }}>
                  {isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                      <Loader2 style={{ width: 32, height: 32, color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div style={{ display: 'flex', alignItems: 'center', padding: '32px', color: textSec }}>
                        <Loader2 style={{ width: 28, height: 28, color: 'var(--accent-primary)' }} />
                        <span style={{ marginLeft: '8px' }}>Loading PDF…</span>
                      </div>
                    }
                    error={
                      <div style={{ textAlign: 'center', padding: '32px', color: textSec }}>
                        <p style={{ marginBottom: '8px' }}>Failed to load PDF</p>
                        <button
                          onClick={() => window.open(resumePdfUrl, '_blank')}
                          style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          Open in new tab
                        </button>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      width={getPageWidth()}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-2xl"
                    />
                  </Document>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderTop: `1px solid ${border}`,
              background: bgHeader,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button style={btnStyle} disabled={currentPage === 1}
                  onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={18} style={{ display: 'block', opacity: currentPage === 1 ? 0.35 : 1 }} />
                </button>
                <button style={btnStyle} disabled={currentPage === totalPages}
                  onMouseEnter={e => (e.currentTarget.style.background = btnHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                  <ChevronRight size={18} style={{ display: 'block', opacity: currentPage === totalPages ? 0.35 : 1 }} />
                </button>
              </div>

              <p style={{ fontSize: '11px', color: textSec }}>
                Scroll to read • Use arrow keys to navigate pages
              </p>

              <div style={{ width: '60px' }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
