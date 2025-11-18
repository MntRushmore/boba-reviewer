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
  const [readme, setReadme] = useState<string | null>(null)
  const [showReadme, setShowReadme] = useState(true)

  useEffect(() => {
    fetchRepoFiles()
  }, [repoUrl])

  const fetchRepoFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/github-files?repoUrl=${encodeURIComponent(repoUrl)}`)
      const data = await res.json()
      setFiles(data.files || [])

      const readmeFile = data.files?.find((f: any) =>
        f.name.toLowerCase() === 'readme.md' ||
        f.name.toLowerCase() === 'readme.txt' ||
        f.name.toLowerCase() === 'readme'
      )
      if (readmeFile) {
        setReadme(readmeFile.content)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
    }
    return langMap[ext || ''] || 'plaintext'
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
        {readme && (
          <button
            onClick={() => setShowReadme(true)}
            className={`px-3 py-1 rounded text-sm font-mono whitespace-nowrap ${showReadme ? 'bg-accent text-white' : 'bg-background text-text hover:bg-border'}`}
          >
            README.md
          </button>
        )}
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => {
              setShowReadme(false)
              setSelectedFile(index)
            }}
            className={`px-3 py-1 rounded text-sm font-mono whitespace-nowrap ${!showReadme && selectedFile === index ? 'bg-accent text-white' : 'bg-background text-text hover:bg-border'}`}
          >
            {file.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {showReadme && readme ? (
          <div className="h-full overflow-auto p-4 bg-white prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-xs">{readme}</pre>
          </div>
        ) : (
          <Editor
            height="100%"
            language={getLanguageFromFilename(files[selectedFile]?.name || '')}
            value={files[selectedFile]?.content || ''}
            theme="vs-light"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'JetBrains Mono, Source Code Pro, monospace',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  )
}