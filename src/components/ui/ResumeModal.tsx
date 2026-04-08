import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Import PDF as URL for better Vite compatibility  
import resumePdfUrl from '/Resume_general.pdf?url'

// Configure PDF.js worker - Using CDN approach from official docs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfFile, setPdfFile] = useState<string | Blob>(resumePdfUrl)
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'custom'>('width')

  // Debug PDF.js configuration and file accessibility
  useEffect(() => {
    console.log('PDF.js version:', pdfjs.version)
    console.log('PDF.js worker source:', pdfjs.GlobalWorkerOptions.workerSrc)
    
    // Test if PDF file is accessible and check headers
    fetch('/Resume_general.pdf')
      .then(response => {
        console.log('PDF file fetch response:', response.status, response.statusText)
        console.log('Content-Type:', response.headers.get('content-type'))
        console.log('Content-Length:', response.headers.get('content-length'))
        console.log('Response headers:', [...response.headers.entries()])
        
        if (response.ok) {
          console.log('✅ PDF file is accessible')
          return response.arrayBuffer()
        } else {
          console.error('❌ PDF file not accessible:', response.status)
          throw new Error(`HTTP ${response.status}`)
        }
      })
      .then(arrayBuffer => {
        console.log('PDF file size:', arrayBuffer.byteLength, 'bytes')
        console.log('First few bytes:', new Uint8Array(arrayBuffer.slice(0, 10)))
        
        // Check if it starts with PDF header
        const header = new Uint8Array(arrayBuffer.slice(0, 4))
        const headerString = String.fromCharCode(...header)
        console.log('PDF header:', headerString)
        
        if (headerString === '%PDF') {
          console.log('✅ Valid PDF header found')
        } else {
          console.error('❌ Invalid PDF header:', headerString)
        }
      })
      .catch(error => {
        console.error('❌ Error fetching PDF file:', error)
      })
  }, [])

  // Handle keyboard navigation
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
    console.log('PDF loaded successfully:', numPages, 'pages')
    setTotalPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('PDF worker src:', pdfjs.GlobalWorkerOptions.workerSrc)
    console.error('PDF.js version:', pdfjs.version)
    setIsLoading(false)
    
    // Try loading via fetch as fallback if direct URL fails
    if (typeof pdfFile === 'string') {
      console.log('🔄 Trying fetch fallback...')
      fetch(resumePdfUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.blob()
        })
        .then(blob => {
          console.log('✅ Loaded PDF via fetch, blob size:', blob.size, 'bytes')
          setPdfFile(blob)
          setIsLoading(true) // Reset loading to try again with blob
        })
        .catch(fetchError => {
          console.error('❌ Fetch fallback also failed:', fetchError)
        })
    }
  }

  // Calculate optimal page width based on fit mode
  const getPageWidth = () => {
    const containerWidth = window.innerWidth - 200 // Modal padding
    const containerHeight = window.innerHeight - 300 // Modal header/footer
    
    switch (fitMode) {
      case 'width':
        return Math.min(containerWidth * 0.8, 800)
      case 'height':
        return Math.min(containerHeight * 0.9, 600) 
      case 'custom':
        return 600 * (zoom / 100)
      default:
        return 600
    }
  }

  // Fit mode handlers
  const handleFitWidth = () => setFitMode('width')
  const handleFitHeight = () => setFitMode('height')

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
            className="fixed inset-0 bg-black/85 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 z-50 flex flex-col bg-bg-card rounded-xl overflow-hidden"
            style={{ border: '2px solid rgba(255, 255, 255, 0.3)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-bg-secondary">
              <div className="flex-1">
                <h3 className="font-mono text-sm text-text-primary">Resume_general.pdf</h3>
                <p className="text-xs text-text-secondary mt-1">
                  {currentPage} / {totalPages} • {fitMode === 'custom' ? `${zoom}%` : `Fit ${fitMode}`}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <button
                  onClick={() => { setZoom(Math.max(50, zoom - 10)); setFitMode('custom'); }}
                  className="p-2 hover:bg-bg-card rounded transition-colors"
                  title="Zoom out"
                >
                  −
                </button>
                <span className="text-xs text-text-secondary w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => { setZoom(Math.min(300, zoom + 10)); setFitMode('custom'); }}
                  className="p-2 hover:bg-bg-card rounded transition-colors"
                  title="Zoom in"
                >
                  +
                </button>

                {/* Fit Mode Controls */}
                <div className="mx-2 h-4 w-px bg-border-subtle"></div>
                <button
                  onClick={handleFitWidth}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    fitMode === 'width' ? 'bg-accent-primary text-white' : 'hover:bg-bg-card text-text-secondary'
                  }`}
                  title="Fit to width"
                >
                  Width
                </button>
                <button
                  onClick={handleFitHeight}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    fitMode === 'height' ? 'bg-accent-primary text-white' : 'hover:bg-bg-card text-text-secondary'
                  }`}
                  title="Fit to height"
                >
                  Height
                </button>
                <button
                  onClick={() => {
                    setZoom(100)
                    setFitMode('width')
                  }}
                  className="px-2 py-1 text-xs rounded hover:bg-bg-card text-text-secondary"
                  title="Reset view"
                >
                  Reset
                </button>

                {/* Download */}
                <button
                  onClick={() => window.open(resumePdfUrl, '_blank')}
                  className="p-2 hover:bg-bg-card rounded transition-colors ml-2"
                  title="Download resume"
                >
                  <Download size={18} className="text-accent-primary" />
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-card rounded transition-colors ml-2"
                  title="Close"
                >
                  <X size={18} className="text-text-secondary hover:text-text-primary" />
                </button>
              </div>
            </div>

            {/* Body - PDF Viewer */}
            <div className="flex-1 overflow-auto bg-bg-primary">
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-bg-primary">
                      <Loader2 className="w-8 h-8 text-accent-primary animate-spin duration-1000" />
                    </div>
                  )}
                
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 text-accent-primary animate-spin duration-1000" />
                      <span className="ml-2">Loading PDF...</span>
                    </div>
                  }
                  error={
                    <div className="text-center p-8 text-text-secondary">
                      <p className="mb-2">❌ Failed to load PDF</p>
                      <p className="text-xs mb-2">PDF.js version: {pdfjs.version}</p>
                      <p className="text-xs mb-2">Worker: {pdfjs.GlobalWorkerOptions.workerSrc}</p>
                      <p className="text-xs">Please try downloading the file instead</p>
                      <button 
                        onClick={() => window.open(resumePdfUrl, '_blank')}
                        className="mt-4 px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary"
                      >
                        Open PDF in new tab
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
            <div className="flex items-center justify-between p-4 border-t border-border-subtle bg-bg-secondary">
              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-bg-card rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-bg-card rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <p className="text-xs text-text-secondary">
                📄 Use zoom and fit controls • Full resolution PDF available for download
              </p>

              <div className="w-20" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
