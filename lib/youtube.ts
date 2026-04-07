export type YoutubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

const CHANNEL_ID = 'UCmScDsMMIadaSAPFwcOGI7A';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decodeXml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function getYoutubeVideos(): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    return entries
      .map((entry) => {
        const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
        const title = decodeXml(entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? '');
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? '';
        return {
          id: videoId,
          title,
          publishedAt: published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
      })
      .filter((v) => v.id);
  } catch {
    return [];
  }
}
