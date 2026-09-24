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

    // Try multiple APIs
    try {
      // API 1: youtube-transcript-api.com
      const res1 = await fetch(`https://youtube-transcript-api.glitch.me/api/transcript?videoId=${videoId}`, {
        timeout: 10000
      })
      if (res1.ok) {
        const data = await res1.json()
        const transcript = data.transcript?.map(item => item.text).join(' ') || data.text
        if (transcript) {
          return Response.json({ transcript })
        }
      }
    } catch (e) {
      console.log('API 1 failed:', e.message)
    }

    try {
      // API 2: Fallback - try yt-api
      const res2 = await fetch(`https://yt-api.p.rapidapi.com/get-transcript?id=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
      })
      if (res2.ok) {
        const data = await res2.json()
        const transcript = data.contents?.map(item => item.text).join(' ')
        if (transcript) {
          return Response.json({ transcript })
        }
      }
    } catch (e) {
      console.log('API 2 failed:', e.message)
    }

    return Response.json({ 
      error: 'Could not fetch transcript. The video may not have captions or transcripts available.' 
    }, { status: 404 })

  } catch (error) {
    return Response.json({ 
      error: 'Failed to extract transcript: ' + error.message 
    }, { status: 500 })
  }
}