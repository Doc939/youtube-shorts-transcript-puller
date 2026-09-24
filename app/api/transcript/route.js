export async function POST(request) {
  try {
    const { url } = await request.json()
    
    // Extract video ID
    let videoId
    try {
      const urlObj = new URL(url)
      videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop()
    } catch {
      videoId = url
    }
    
    if (!videoId || videoId.length !== 11) {
      return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Dynamically import to avoid build-time issues
    const { getTranscript } = await import('youtube-transcript')
    
    const transcript = await getTranscript(videoId)
    
    if (!transcript || transcript.length === 0) {
      return Response.json({ 
        error: 'No captions found for this video' 
      }, { status: 404 })
    }
    
    const fullText = transcript.map(item => item.text).join(' ')
    
    return Response.json({ transcript: fullText })
    
  } catch (error) {
    console.error('Transcript error:', error)
    return Response.json({ 
      error: 'Could not fetch transcript: ' + error.message 
    }, { status: 500 })
  }
}