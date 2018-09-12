import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { load } from 'cheerio'

import search from './search'

const path = resolve(__dirname, './data/suchen')

describe('duden search', () => {
  it('runs', () => {
    const length = {
      Debatte: 1,
      sein: 4,
      Gedanke: 1,
      Gedanken: 1
    }
    const files = readdirSync(path).filter(file => file.endsWith('htm'))
    files.forEach(file => {
      const word = file.replace('Duden _ Suchen _ ', '').replace('.htm', '')
      const html = readFileSync(resolve(path, file))
      const $ = load(html)
      const links = search($)
      expect(Array.isArray(links)).toBe(true)
      expect(links.length).toBe(length[word])
    })
  })
})
