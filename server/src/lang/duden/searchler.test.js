import Searchler from '../searchler'
import parse from './search'

describe('Searchler', () => {
  it('runs', done => {
    const searchler = Searchler(parse)
    searchler.on('drain', () => {
      expect(searchler.result.length).toBe(1)
      const result = searchler.result[0]
      expect(result.stem).toBe('Debatte')
      expect(result.links).toContain(
        'https://www.duden.de/rechtschreibung/Debatte'
      )
      done()
    })
    searchler.queue(['https://www.duden.de/suchen/dudenonline/Debatte'])
  })
})
