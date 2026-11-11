// Controleert of nl.json en fr.json synchroon zijn:
// - exact dezelfde sleutels en lijstlengtes,
// - geen lege Franse teksten,
// - geen zinnen die in het Frans nog letterlijk Nederlands zijn.
// Gebruik: pnpm i18n:check
import { readFileSync } from 'node:fs'

const load = (locale) => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'))
const nl = load('nl')
const fr = load('fr')

// Teksten die in beide talen bewust gelijk zijn.
const SAME_ALLOWED = new Set(['Horeca & retail', 'Carpetz Go', 'Carpetz Green', 'Carpetz Studio', 'Carpetz Pro', 'Carpetz Grip', 'Carpetz Scrape', 'NFSI High-Traction'])

// Een tekst telt als "zin" als hij minstens twee woorden van 4+ letters bevat
// (maten, codes en normen zoals "2,4 mm" of "EN13501-1 / Cfl-s1" vallen dus weg).
const isSentence = (text) => (text.match(/\p{L}{4,}/gu) ?? []).length >= 2

const problems = []
const join = (path, key) => (path ? `${path}.${key}` : key)

function walk(a, b, path) {
  if (typeof a === 'object' && a !== null && !Array.isArray(a)) {
    if (typeof b !== 'object' || b === null || Array.isArray(b)) return problems.push(`Ander type: ${path}`)
    for (const key of Object.keys(a)) {
      if (!(key in b)) problems.push(`Ontbreekt in fr.json: ${join(path, key)}`)
      else walk(a[key], b[key], join(path, key))
    }
    for (const key of Object.keys(b)) if (!(key in a)) problems.push(`Ontbreekt in nl.json: ${join(path, key)}`)
    return
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`Ander type: ${path}`)
    if (a.length !== b.length) problems.push(`Andere lijstlengte (nl ${a.length}, fr ${b.length}): ${path}`)
    a.forEach((item, i) => walk(item, b[i], `${path}[${i}]`))
    return
  }
  if (typeof a !== typeof b) return problems.push(`Ander type: ${path}`)
  if (typeof b === 'string' && b.trim() === '') return problems.push(`Lege Franse tekst: ${path}`)
  if (typeof a === 'string' && a === b && isSentence(a) && !SAME_ALLOWED.has(a)) {
    problems.push(`Niet vertaald (identiek aan nl): ${path} = "${a}"`)
  }
}

walk(nl, fr, '')

if (problems.length) {
  console.error(`✗ ${problems.length} vertaalprobleem(en):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log('✓ nl.json en fr.json zijn volledig synchroon.')
