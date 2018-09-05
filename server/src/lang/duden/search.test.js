import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { load } from 'cheerio'

import search from './search'

const path = resolve(__dirname, './data/suchen')

describe('duden search', () => {
  it('runs', () => {
    const files = readdirSync(path).filter(file => file.endsWith('htm'))
    files.forEach(file => {
      const html = readFileSync(resolve(path, file))
      const $ = load(html)
      const links = search($)
      expect(Array.isArray(links)).toBe(true)
    })
  })
})
