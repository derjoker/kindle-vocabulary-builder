import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { load } from 'cheerio'

import parse from './parse'

const path = resolve(__dirname, './data/rechtschreibung')

describe('duden parse', () => {
  it('runs', () => {
    const files = readdirSync(path).filter(file => file.endsWith('htm'))
    files.forEach(file => {
      const html = readFileSync(resolve(path, file))
      const $ = load(html)
      const word = parse($)
      expect(word.word).toBeDefined()
      expect(Array.isArray(word.pairs)).toBe(true)
    })
  })
})
