import search from './search'

describe('search', () => {
  it('runs', done => {
    const vocabs = [
      {
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AewHAACHAAAA:225937:7',
        lang: 'de',
        stem: 'fallen'
      },
      {
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AQcIAACgAQAA:231309:10',
        lang: 'de',
        stem: 'Fleisch'
      },
      {
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AfgHAAAgAQAA:228183:12',
        lang: 'de',
        stem: 'entblößen'
      }
    ]

    search(vocabs, result => {
      // expect(result).toEqual([])

      expect(result).toContainEqual({
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AewHAACHAAAA:225937:7',
        build: true,
        links: ['https://www.duden.de/rechtschreibung/fallen']
      })
      expect(result).toContainEqual({
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AQcIAACgAQAA:231309:10',
        build: true,
        links: ['https://www.duden.de/rechtschreibung/Fleisch']
      })
      expect(result).toContainEqual({
        id: 'CR!MCSHTB9ES11E54NEGPHJAYY2GBB8:AfgHAAAgAQAA:228183:12',
        build: true,
        links: ['https://www.duden.de/rechtschreibung/entbloeszen']
      })

      done()
    })
  })
})
