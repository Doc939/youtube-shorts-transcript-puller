'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExtract = async () => {
    if (!url.trim()) { setError('Enter URL'); return }
    setLoading(true); setError(''); setTranscript('')
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setTranscript(data.transcript)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">YouTube Shorts Transcript</h1>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL..." className="w-full px-4 py-2 border rounded" />
        <button onClick={handleExtract} disabled={loading} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded">{loading ? 'Loading...' : 'Extract'}</button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {transcript && <div className="mt-4 p-4 bg-white rounded"><p>{transcript}</p></div>}
      </div>
    </div>
  )
}
