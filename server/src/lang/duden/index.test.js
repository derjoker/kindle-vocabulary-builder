import { uniq } from 'lodash'

import duden from './index'
import { List, Vocab } from '../../model'

describe('duden', () => {
  it(
    'runs',
    async done => {
      const lang = 'de'
      const title = 'Rebengold (German Edition)'
      const doc = {
        name: 'name',
        lang,
        title
      }
      const list = await List.upsert(doc)
      const vocabs = await Vocab.find({
        lang,
        title
      })
      const stems = uniq(vocabs.map(vocab => vocab.stem))
      list.stems = stems.slice(0, 2)
      duden(list, done)
    },
    50000
  )
})
