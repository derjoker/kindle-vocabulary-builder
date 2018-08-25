const { parse, search } = require('./duden')

describe('duden', () => {
  it('runs', () => {
    parse()
    parse([
      'https://www.duden.de/rechtschreibung/Mund_Oeffnung_Lippen_Schlund',
      'https://www.duden.de/rechtschreibung/Aa_Kot',
      'https://www.duden.de/rechtschreibung/schlieszen',
      'https://www.duden.de/rechtschreibung/eisern' // TODO: RECHTSCHREIBUNG
    ])

    search()
    search(['Debatte', 'machen'])
  })
})
