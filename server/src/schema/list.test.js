import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import fetch from 'unfetch'
import { pick, uniq } from 'lodash'

import { List, Vocab } from '../model'

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  fetch: fetch
})

const CREATE_LIST = gql`
mutation CreateList {
  createList(list: {
    name: "Rebengold (German Edition)",
    lang: "de",
    title: "Rebengold (German Edition)"
  }) {
    id
    name
    lang
    title
  }
}
`

const UPDATE_STEMS = gql`
mutation UpdateStems ($id: ID!) {
  updateStems(id: $id) {
    id
    stems
  }
}
`

describe('schema list', () => {
  it('create list', async () => {
    const doc = {
      name: 'Rebengold (German Edition)',
      lang: 'de',
      title: 'Rebengold (German Edition)'
    }

    const { data: { createList } } = await client.mutate({
      mutation: CREATE_LIST
    })

    expect(createList.id).toBeDefined()
    expect(pick(createList, ['name', 'lang', 'title'])).toEqual(doc)
  })

  it('update stems (lang)', async () => {
    const doc = {
      name: 'Deutsch',
      lang: 'de'
    }

    const list = await List.upsert(doc)
    const { data: { updateStems } } = await client.mutate({
      mutation: UPDATE_STEMS,
      variables: { id: list.id }
    })

    expect(updateStems.id).toEqual(list.id)
    const vocabs = await Vocab.find({
      lang: 'de'
    })
    expect(updateStems.stems).toEqual(uniq(vocabs.map(vocab => vocab.stem)))
  })

  it('update stems (lang, title)', async () => {
    const doc = {
      name: 'Rebengold (German Edition)',
      lang: 'de',
      title: 'Rebengold (German Edition)'
    }

    const list = await List.upsert(doc)
    const { data: { updateStems } } = await client.mutate({
      mutation: UPDATE_STEMS,
      variables: { id: list.id }
    })

    expect(updateStems.id).toEqual(list.id)
    const vocabs = await Vocab.find({
      lang: 'de',
      title: 'Rebengold (German Edition)'
    })
    expect(updateStems.stems).toEqual(uniq(vocabs.map(vocab => vocab.stem)))
  })
})
