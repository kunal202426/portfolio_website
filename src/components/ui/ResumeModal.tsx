import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)

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
    setTotalPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error)
    setIsLoading(false)
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
            className="fixed inset-0 bg-black/85 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 z-50 flex flex-col bg-bg-card rounded-xl border border-border-subtle overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-bg-secondary">
              <div className="flex-1">
                <h3 className="font-mono text-sm text-text-primary">Resume_general.pdf</h3>
                <p className="text-xs text-text-secondary mt-1">{currentPage} / {totalPages}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-2 hover:bg-bg-card rounded transition-colors"
                  title="Zoom out"
                >
                  −
                </button>
                <span className="text-xs text-text-secondary w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="p-2 hover:bg-bg-card rounded transition-colors"
                  title="Zoom in"
                >
                  +
                </button>

                {/* Download */}
                <button
                  onClick={() => window.open('/Resume_general.pdf', '_blank')}
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
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-bg-primary">
              <div className="relative" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                  </div>
                )}
                
                <Document
                  file="/Resume_general.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                    </div>
                  }
                  error={
                    <div className="text-center p-8 text-text-secondary">
                      <p className="mb-2">❌ Failed to load PDF</p>
                      <p className="text-xs">Please try downloading the file instead</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={currentPage}
                    width={600}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-2xl"
                  />
                </Document>
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
                📄 Full resolution PDF available for download
              </p>

              <div className="w-20" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
