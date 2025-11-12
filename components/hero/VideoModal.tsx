'use client'

import React, { useEffect, useRef } from 'react'
import Modal from '@/components/ui/Modal'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoId?: string
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId = 'N-HAIC6YVSo' // PEG Security official video
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Stop video when modal closes
  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      const iframe = iframeRef.current
      const iframeSrc = iframe.src
      iframe.src = iframeSrc // Reset iframe to stop video
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton
      closeOnOverlayClick
      className="!p-0"
    >
      <div className="relative w-full aspect-video">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="PEG Security Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
        />
      </div>
    </Modal>
  )
}

export default VideoModal
