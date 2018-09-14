import { flatten, uniq, difference } from 'lodash'
import hash from 'object-hash'
import { load } from 'cheerio'

import { Vocab, Word } from '../model'
import search from './search'
import lookup from './lookup'

export default async function build (vocabs) {
  search(vocabs, async result => {
    const _vocabs = await Vocab.update(result)
    let links = uniq(flatten(_vocabs.map(vocab => vocab.links)))
    const _links = await Word.distinct('link', {})
    links = difference(links, _links)

    lookup(links, async result => {
      const words = flatten(
        result.map(word =>
          word.pairs.map(pair => {
            pair.link = word.link
            pair.word = word.word
            pair.id = hash(pair)
            pair.text = load(pair.example).text()
            return pair
          })
        )
      )
      await Word.upsert(words)
      console.log('done')
    })
  })
}
