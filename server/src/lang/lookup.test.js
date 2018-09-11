import { find } from 'lodash'

import lookup from './lookup'

describe('lookup', () => {
  it('runs', done => {
    const links = [
      'https://www.duden.de/rechtschreibung/fallen',
      'https://www.merriam-webster.com/dictionary/stake'
    ]

    lookup(links, result => {
      // expect(result).toEqual([])

      const fallen = find(result, {
        link: 'https://www.duden.de/rechtschreibung/fallen',
        word: 'fallen'
      })
      expect(fallen.pairs).toContainEqual({
        definition: ' in bestimmter Weise nach unten h&#xE4;ngen',
        example: '<span><span>die Gardinen fallen locker</span></span>'
      })

      done()
    })
  })
})
