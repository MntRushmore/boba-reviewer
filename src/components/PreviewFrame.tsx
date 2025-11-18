'use client'

interface PreviewFrameProps {
  url: string
}

export default function PreviewFrame({ url }: PreviewFrameProps) {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
      <iframe src={url} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-forms" title="Preview" />
    </div>
  )
}