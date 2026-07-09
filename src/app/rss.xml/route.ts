import { all } from '@/lib/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

function escape(s = '') {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!,
  )
}

export function GET() {
  const posts = [...all('blog'), ...all('research'), ...all('projects')]
    .filter((e) => e.date)
    .sort((a, b) => +new Date(b.date!) - +new Date(a.date!))
    .slice(0, 40)

  const items = posts
    .map(
      (e) => `    <item>
      <title>${escape(e.title)}</title>
      <link>${site.url}${e.url}</link>
      <guid>${site.url}${e.url}</guid>
      <pubDate>${new Date(e.date!).toUTCString()}</pubDate>
      <description>${escape(e.description ?? e.subtitle)}</description>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
