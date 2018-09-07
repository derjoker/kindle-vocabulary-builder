import Scrapeler from '../scrapeler'
import parse from './parse'

describe('Scrapeler', () => {
  it('runs', done => {
    const scrapeler = Scrapeler(parse)
    scrapeler.on('drain', () => {
      const words = scrapeler.result
      expect(words.length).toBe(1)
      expect(words[0].link).toBe('https://www.duden.de/rechtschreibung/Debatte')
      expect(words[0].word).toBe('Debatte, die')
      done()
    })
    scrapeler.queue(['https://www.duden.de/rechtschreibung/Debatte'])
  })
})
