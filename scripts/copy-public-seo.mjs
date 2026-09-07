#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
mkdirSync(dist, { recursive: true })

for (const name of ['sitemap.xml', 'robots.txt', 'logo.png', 'logo.svg']) {
  const src = join(root, 'public', name)
  if (existsSync(src)) copyFileSync(src, join(dist, name))
}

console.log('SEO/public assets copied to dist/')
