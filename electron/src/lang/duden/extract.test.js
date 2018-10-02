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

  it('Debatte', () => {
    const html = readFileSync(
      resolve(
        path,
        'Duden _ Aus_füh_rung _ Rechtschreibung, Bedeutung, Definition, Synonyme.htm'
      )
    )
    const $ = load(html)
    const entry = extract($)
    expect(entry).toEqual({
      word: 'Ausführung, die',
      definitions: [
        {
          definition: ' das Ausf&#xFC;hren, Verwirklichen, Realisieren',
          examples: [
            {
              example: '<li><span><span>die Ausf&#xFC;hrung des Plans, des Vorhabens scheiterte</span></span></li>',
              text: 'die Ausführung des Plans, des Vorhabens scheiterte'
            },
            {
              example: '<li>(nachdr&#xFC;cklich) <span><span>etwas zur Ausf&#xFC;hrung bringen</span></span> <em>(etwas ausf&#xFC;hren)</em></li>',
              text: '(nachdrücklich) etwas zur Ausführung bringen (etwas ausführen)'
            },
            {
              example: '<li>(nachdr&#xFC;cklich) <span><span>zur Ausf&#xFC;hrung gelangen/kommen</span></span> <em>(ausgef&#xFC;hrt werden)</em></li>',
              text: '(nachdrücklich) zur Ausführung gelangen/kommen (ausgeführt werden)'
            }
          ]
        },
        {
          definition: ' das weisungsgem&#xE4;&#xDF;e Ausf&#xFC;hren; Vollzug',
          examples: [
            {
              example: '<span><span>die Ausf&#xFC;hrung eines Befehls, eines Auftrags</span></span>',
              text: 'die Ausführung eines Befehls, eines Auftrags'
            }
          ]
        },
        {
          definition: ' das Ausf&#xFC;hren (einer Arbeit o. &#xC4;.), Erledigung',
          examples: [
            {
              example: '<span><span>die Ausf&#xFC;hrung der Reparatur nimmt mehrere Wochen in Anspruch</span></span>',
              text: 'die Ausführung der Reparatur nimmt mehrere Wochen in Anspruch'
            }
          ]
        },
        {
          definition: ' Ausarbeitung, Vollendung',
          examples: [
            {
              example: '<span><span>die Ausf&#xFC;hrung [der Skizzen] vornehmen</span></span>',
              text: 'die Ausführung [der Skizzen] vornehmen'
            }
          ]
        },
        {
          definition: ' Herstellungsart, Qualit&#xE4;t, Ausstattung',
          examples: [
            {
              example: '<li><span><span>eine einfache, elegante Ausf&#xFC;hrung</span></span></li>',
              text: 'eine einfache, elegante Ausführung'
            },
            {
              example: '<li><span><span>Ledertaschen in verschiedenen Ausf&#xFC;hrungen</span></span></li>',
              text: 'Ledertaschen in verschiedenen Ausführungen'
            }
          ]
        },
        {
          definition: ' das Ausf&#xFC;hren einer bestimmten Bewegung',
          examples: [
            {
              example: '<li><span><span>die exakte Ausf&#xFC;hrung der Tanzschritte ist wichtig</span></span></li>',
              text: 'die exakte Ausführung der Tanzschritte ist wichtig'
            },
            {
              example: '<li>(Fu&#xDF;ball, Eishockey) <span><span>die Ausf&#xFC;hrung eines Freisto&#xDF;es</span></span></li>',
              text: '(Fußball, Eishockey) die Ausführung eines Freistoßes'
            }
          ]
        },
        {
          definition: ' Darlegung',
          examples: [
            {
              example: '<span><span>seine Ausf&#xFC;hrungen waren langweilig, nicht sehr &#xFC;berzeugend</span></span>',
              text: 'seine Ausführungen waren langweilig, nicht sehr überzeugend'
            }
          ]
        }
      ]
    })
  })
})
