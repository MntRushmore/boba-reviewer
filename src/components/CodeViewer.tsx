'use client'

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

interface CodeViewerProps {
  repoUrl: string
}

export default function CodeViewer({ repoUrl }: CodeViewerProps) {
  const [files, setFiles] = useState<{ name: string; content: string }[]>([])
  const [selectedFile, setSelectedFile] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRepoFiles()
  }, [repoUrl])

  const fetchRepoFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/github-files?repoUrl=${encodeURIComponent(repoUrl)}`)
      const data = await res.json()
      setFiles(data.files || [])
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-mutedText py-8">Loading code...</div>
  }

  if (files.length === 0) {
    return (
      <div className="text-center text-mutedText py-8">
        <p>No files found or unable to fetch repository</p>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View on GitHub</a>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => setSelectedFile(index)}
            className={`px-3 py-1 rounded text-sm font-mono whitespace-nowrap ${selectedFile === index ? 'bg-accent text-white' : 'bg-background text-text hover:bg-border'}`}
          >
            {file.name}
          </button>
        ))}
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={files[selectedFile]?.content || ''}
          theme="vs-light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'Source Code Pro, monospace',
          }}
        />
      </div>
    </div>
  )
}