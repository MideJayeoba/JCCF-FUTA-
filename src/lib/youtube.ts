/**
 * YouTube Utility Helper
 * Supports extracting video IDs, high-resolution thumbnails, and fetching metadata
 * from standard YouTube video URLs, shorts, embeds, and live streams.
 */

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  embedUrl: string;
  duration?: string;
  description?: string;
}

/**
 * Extracts standard 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Raw video ID
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching various YouTube URL patterns
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

/**
 * Generates the best available YouTube thumbnail URL for a video ID.
 */
export function getYouTubeThumbnail(videoId: string, quality: 'max' | 'hq' | 'mq' = 'hq'): string {
  if (!videoId) return '';
  if (quality === 'max') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Generates an embed-safe YouTube player URL.
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Fetches YouTube video metadata via backend proxy or public oEmbed fallback.
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata | null> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const defaultThumb = getYouTubeThumbnail(videoId, 'hq');
  const embedUrl = getYouTubeEmbedUrl(videoId);

  try {
    // 1. Attempt backend API endpoint
    const res = await fetch(`/api/youtube/metadata?videoId=${encodeURIComponent(videoId)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        videoId,
        title: data.title || 'JCCF Broadcast / Sermon',
        authorName: data.authorName || 'JCCF FUTA Media',
        thumbnailUrl: data.thumbnailUrl || defaultThumb,
        embedUrl,
        duration: data.duration || '',
        description: data.description || ''
      };
    }
  } catch {
    // Fallback if backend route fails
  }

  try {
    // 2. Direct client-side noembed fallback
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
    const oRes = await fetch(oembedUrl);
    if (oRes.ok) {
      const data = await oRes.json();
      return {
        videoId,
        title: data.title || 'JCCF Broadcast / Sermon',
        authorName: data.author_name || 'JCCF FUTA Media',
        thumbnailUrl: data.thumbnail_url || defaultThumb,
        embedUrl,
        duration: '',
        description: ''
      };
    }
  } catch {
    // Return base object with extracted ID and thumbnail
  }

  return {
    videoId,
    title: 'JCCF FUTA Broadcast',
    authorName: 'JCCF FUTA Media',
    thumbnailUrl: defaultThumb,
    embedUrl,
    duration: '',
    description: ''
  };
}
