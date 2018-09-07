import { difference, flatten, uniq } from 'lodash'
import hash from 'object-hash'

import { List, Word, Card } from '../../model'
import Searchler from '../searchler'
import Scrapeler from '../scrapeler'
import search from './search'
import parse from './parse'

export const baseUrl = 'https://www.duden.de/suchen/dudenonline/'

export default function duden (list, done) {
  const searchler = Searchler(search)
  const scrapeler = Scrapeler(parse)

  searchler.on('drain', async () => {
    list.searches = list.searches.concat(searchler.result)

    const links = uniq(flatten(list.searches.map(search => search.links)))
    // TODO: find words by links directly
    const words = await Word.find({ link: { $in: links } })
    const foundLinks = words.map(word => word.link)

    const _links = difference(links, foundLinks)
    scrapeler.queue(_links)
  })

  scrapeler.on('drain', async () => {
    const _words = flatten(
      scrapeler.result.map(word =>
        word.pairs.map(pair => {
          pair.link = word.link
          pair.word = word.word
          pair.id = hash(pair)
          return pair
        })
      )
    )
    await Word.upsert(_words)

    const links = uniq(flatten(list.searches.map(search => search.links)))
    const words = await Word.find({ link: { $in: links } })
    const cards = await Card.upsert(
      words.map(word => {
        const card = {
          // userId: 'userId',
          wordId: word.id
        }
        card.id = hash(card)
        return card
      })
    )
    list.cardIds = cards.map(card => card.id)
    await List.update(list)
    done()
  })

  const _stems = difference(
    list.stems,
    list.searches.map(search => search.stem)
  )
  searchler.queue(_stems.map(stem => baseUrl + stem))
}
