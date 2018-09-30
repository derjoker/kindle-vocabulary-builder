import duden from '.'

describe('duden', () => {
  it(
    'runs',
    done => {
      const words = [{ stem: 'Debatte' }, { stem: 'sein' }]
      duden(words, () => {
        done()
      })
    },
    20000
  )

  it(
    'Debatte',
    done => {
      const words = [{ stem: 'Debatte' }]
      duden(words, () => {
        // expect(words).toEqual([])
        const word = words[0]
        expect(word.stem).toBe('Debatte')
        const entry = word.entries[0]
        // expect(entry).toEqual({})
        expect(entry.word).toBe('Debatte, die')
        expect(entry.link).toBe('https://www.duden.de/rechtschreibung/Debatte')
        done()
      })
    },
    20000
  )
})
