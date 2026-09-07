/**
 * Shared Cloudflare Worker `allworld` — static site router for zizhong-med-bid
 * Site path on R2: allworld-sites/zizhong-med-bid/
 * Assets bucket: zizhong-med-bid-assets
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const host = url.hostname

    // Route host -> R2 site prefix
    if (host === 'zizhong-med-bid.softwarelink.net' || host.endsWith('localhost')) {
      return serveFromR2(request, env, 'allworld-sites/zizhong-med-bid')
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function serveFromR2(request, env, prefix) {
  const url = new URL(request.url)
  let key = url.pathname.replace(/^\/+/, '')
  if (!key || key.endsWith('/')) key += 'index.html'

  // SPA fallback
  let object = await env.SITES_BUCKET.get(`${prefix}/${key}`)
  if (!object && !key.includes('.')) {
    object = await env.SITES_BUCKET.get(`${prefix}/index.html`)
  }
  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', key.endsWith('.html') ? 'no-cache' : 'public, max-age=86400')
  return new Response(object.body, { headers })
}
