const HOST = 'https://zizhong-med-bid.softwarelink.net'
const lastmod = '2026-09-03'

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily', image: true },
  { path: '/login', priority: '0.6', changefreq: 'monthly' },
  { path: '/quality', priority: '0.8', changefreq: 'weekly' },
  { path: '/performance', priority: '0.8', changefreq: 'weekly' },
  { path: '/pathway', priority: '0.8', changefreq: 'weekly' },
  { path: '/workflow', priority: '0.7', changefreq: 'weekly' },
  { path: '/announcements', priority: '0.6', changefreq: 'weekly' },
  { path: '/system/users', priority: '0.4', changefreq: 'monthly' },
  { path: '/bid/N5110252026000107', priority: '0.8', changefreq: 'weekly' },
]

const urls = routes
  .map((r) => {
    const imageXml = r.image
      ? `
    <image:image>
      <image:loc>${HOST}/logo.png</image:loc>
      <image:title>Zizhong Hospital Logo</image:title>
    </image:image>`
      : ''
    return `  <url>
    <loc>${HOST}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${imageXml}
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'public'), { recursive: true })
mkdirSync(join(root, 'dist-sitemap'), { recursive: true })
writeFileSync(join(root, 'public', 'sitemap.xml'), xml)
writeFileSync(join(root, 'dist-sitemap', 'sitemap.xml'), xml)
console.log('sitemap.xml generated for R2 path allworld-sites/zizhong-med-bid/')
