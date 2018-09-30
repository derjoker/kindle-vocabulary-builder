import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { load } from 'cheerio'

import extract from './extract'

const path = resolve(__dirname, './data/rechtschreibung')

describe('duden extract', () => {
  it('runs', () => {
    const files = readdirSync(path).filter(file => file.endsWith('htm'))
    files.forEach(file => {
      const html = readFileSync(resolve(path, file))
      const $ = load(html)
      const entry = extract($)
      expect(entry.word).toBeDefined()
      expect(Array.isArray(entry.definitions)).toBe(true)
    })
  })

  it('Debatte', () => {
    const html = readFileSync(
      resolve(
        path,
        'Duden _ De_bat_te _ Rechtschreibung, Bedeutung, Definition, Synonyme, Herkunft.htm'
      )
    )
    const $ = load(html)
    const entry = extract($)
    // expect(entry).toEqual({})
    expect(entry.word).toBe('Debatte, die')
    expect(entry.definitions.map(definition => definition.definition)).toEqual([
      ' lebhafte Diskussion, Auseinandersetzung, Streitgespr&#xE4;ch',
      ' lebhafte Diskussion, Auseinandersetzung, Streitgespr&#xE4;ch',
      ' Er&#xF6;rterung eines Themas im Parlament'
    ])
    expect(
      entry.definitions.map(definition =>
        definition.examples.map(example => example.text)
      )
    ).toEqual([
      [
        'eine erregte, lebhafte Debatte ist im Gang',
        'etwas in die Debatte werfen',
        'in eine Debatte eingreifen'
      ],
      [
        'etwas zur Debatte stellen (Diskussion)',
        'zur Debatte stehen (Diskussion)'
      ],
      [
        'die Debatte über die Regierungserklärung dauert an, wird unterbrochen, vertagt, wurde fortgesetzt'
      ]
    ])
  })
})
