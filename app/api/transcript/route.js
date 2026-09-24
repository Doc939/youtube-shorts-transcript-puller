export async function POST(request) {
  try {
    const { url } = await request.json()
    
    const urlObj = new URL(url)
    let videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop()
    
    if (!videoId) {
      return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`)
    
    if (!response.ok) {
      return Response.json({ 
        error: 'Could not fetch transcript. Make sure the video has captions.' 
      }, { status: 404 })
    }

    const xml = await response.text()
    
    const regex = /<text[^>]*>([^<]*)<\/text>/g
    const matches = xml.matchAll(regex)
    const transcript = Array.from(matches).map(m => m[1]).join(' ')
    
    if (!transcript) {
      return Response.json({ 
        error: 'No captions found for this video' 
      }, { status: 404 })
    }

    return Response.json({ transcript })
  } catch (error) {
    return Response.json({ 
      error: 'Failed to extract transcript: ' + error.message 
    }, { status: 500 })
  }
}