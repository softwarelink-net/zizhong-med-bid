import type { SeoMeta } from '@/types'

const DEFAULT_OG = 'https://zizhong-med-bid.softwarelink.net/logo.png'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applySeoMeta(meta: SeoMeta) {
  document.title = meta.title
  upsertMeta('name', 'description', meta.description)
  upsertMeta('name', 'keywords', meta.keywords)
  upsertMeta('property', 'og:title', meta.title)
  upsertMeta('property', 'og:description', meta.description)
  upsertMeta('property', 'og:image', meta.ogImage || DEFAULT_OG)
  upsertMeta('property', 'og:type', 'website')
}

export function injectNewsArticleJsonLd(meta: SeoMeta) {
  const id = 'zzmed-jsonld'
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: meta.title,
    description: meta.description,
    image: meta.ogImage || DEFAULT_OG,
    datePublished: meta.datePublished || '2026-09-03',
    author: {
      '@type': 'Organization',
      name: 'SoftwareLink',
    },
  })
}

export function removeJsonLd() {
  document.getElementById('zzmed-jsonld')?.remove()
}
