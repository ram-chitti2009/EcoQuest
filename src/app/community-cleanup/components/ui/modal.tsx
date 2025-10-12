"use client"

import type React from "react"

import { X } from "lucide-react"
import { forwardRef } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, children, className = "" }, ref) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
      <div ref={ref} className={`bg-white text-black rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide ${className}`}>
        {children}
      </div>
    </div>
  )
})

const ModalHeader = forwardRef<HTMLDivElement, { children: React.ReactNode; onClose?: () => void; className?: string }>(
  ({ children, onClose, className = "" }, ref) => {
    return (
      <div ref={ref} className={`flex justify-between items-start p-6 pb-4 text-black ${className}`}>
        <div className="flex-1">{children}</div>
        {onClose && (
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 ml-4">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    )
  },
)

const ModalContent = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`px-6 pb-6 text-black ${className}`}>
        {children}
      </div>
    )
  },
)

Modal.displayName = "Modal"
ModalHeader.displayName = "ModalHeader"
ModalContent.displayName = "ModalContent"

export { Modal, ModalContent, ModalHeader }

