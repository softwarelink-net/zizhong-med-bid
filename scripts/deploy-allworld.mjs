#!/usr/bin/env node
/**
 * Upload dist/ to:
 *   1) R2 zizhong-med-bid-assets  (project bucket)
 *   2) R2 allworld-sites/zizhong-med-bid/  (shared Allworld host)
 * Only writes this site's prefix — does not touch other sites under allworld-sites/.
 * Do NOT run `wrangler deploy` for the shared allworld Worker unless intentionally updating it.
 */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const dist = join(root, 'dist')
const siteId = process.argv[2] || 'zizhong-med-bid'
const projectBucket = 'zizhong-med-bid-assets'
const sitesBucket = 'allworld-sites'
const CONCURRENCY = 6

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.sqlite': 'application/x-sqlite3',
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.assetsignore' || name === '.DS_Store' || name === '_routes.json') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function put(bucket, key, file, ct) {
  return new Promise((resolve, reject) => {
    console.log(`PUT ${bucket}/${key}`)
    const child = spawn(
      'npx',
      [
        'wrangler',
        'r2',
        'object',
        'put',
        `${bucket}/${key}`,
        `--file=${file}`,
        `--content-type=${ct}`,
        '--remote',
      ],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let err = ''
    child.stderr.on('data', (d) => {
      err += d.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`put failed ${bucket}/${key}\n${err}`))
    })
  })
}

async function runPool(tasks, limit) {
  let i = 0
  let active = 0
  let failed = null
  return new Promise((resolve, reject) => {
    const next = () => {
      if (failed) return
      if (i >= tasks.length && active === 0) return resolve()
      while (active < limit && i < tasks.length) {
        const task = tasks[i++]
        active++
        task()
          .then(() => {
            active--
            next()
          })
          .catch((e) => {
            failed = e
            reject(e)
          })
      }
    }
    next()
  })
}

if (!existsSync(dist)) {
  console.error('dist/ missing. Run pnpm build first.')
  process.exit(1)
}

const files = walk(dist)
if (!files.length) {
  console.error('dist/ is empty. Run pnpm build first.')
  process.exit(1)
}

const tasks = []
for (const file of files) {
  const rel = relative(dist, file).replace(/\\/g, '/')
  const ct = mime[extname(file).toLowerCase()] || 'application/octet-stream'
  tasks.push(() => put(projectBucket, rel, file, ct))
  tasks.push(() => put(sitesBucket, `${siteId}/${rel}`, file, ct))
}

console.log(`Uploading ${files.length} files × 2 buckets (${tasks.length} puts, concurrency=${CONCURRENCY})…`)

try {
  await runPool(tasks, CONCURRENCY)
  console.log(`\nUploaded ${files.length} files × 2 buckets`)
  console.log(`→ Host: https://${siteId}.softwarelink.net/`)
  console.log(`→ R2:   ${projectBucket} + ${sitesBucket}/${siteId}/`)
} catch (e) {
  console.error(e)
  process.exit(1)
}
