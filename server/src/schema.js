import { gql } from 'apollo-server'
import { uniq } from 'lodash'

import { Vocab, Card, List } from './model'
import duden from './lang/duden'

export const typeDefs = gql`
type User {
  id: ID!
  email: String!
  name: String!
}

type Vocab {
  id: ID!
  usage: String
  word: String
  stem: String
  lang: String
  title: String
}

input VocabInput {
  id: ID!
  # userId: ID
  usage: String
  word: String
  stem: String
  lang: String
  title: String
}

type Word {
  id: ID!
  link: String
  word: String
  example: String
  definition: String
}

# Card = Word + note + category
type Card {
  id: ID!
  link: String
  word: String
  example: String
  definition: String
  note: String
  category: String
}

input CardInput {
  id: ID!
  wordId: ID!
  note: String
  category: String
}

type List {
  id: ID!
  name: String!
  lang: String!
  title: String
  stems: [String]
  cards: [Card]
}

input ListInput {
  id: ID
  name: String
  userId: ID
  lang: String
  title: String
}

type Query {
  vocabs: [Vocab]
  lists: [List]
  list(id: ID!): List
}

type Mutation {
  upsertVocabs (vocabs: [VocabInput]!) : [Vocab]
  updateVocab (vocab: VocabInput!) : Vocab
  createList (list: ListInput!) : List
  updateStems (id: ID!) : List
  buildList (id: ID!) : List
}
`

export const resolvers = {
  Query: {
    vocabs: () => Vocab.find({}),
    lists: () => List.find({}),
    list: (_, { id }) => List.findById(id)
  },
  List: {
    cards: list => Card.fetch(list.cardIds)
  },
  Mutation: {
    upsertVocabs: (_, { vocabs }) => Vocab.upsert(vocabs),
    updateVocab: (_, { vocab }) => Vocab.update(vocab),
    createList: (_, { list }) => List.upsert(list),
    updateStems: async (_, { id }) => {
      const list = await List.findById(id)
      const condition = {
        lang: list.lang
      }
      if (list.title) condition.title = list.title
      const vocabs = await Vocab.find(condition)
      const stems = uniq(vocabs.map(vocab => vocab.stem))
      list.stems = stems
      return List.update(list)
    },
    buildList: async (_, { id }) => {
      const list = await List.findById(id)
      duden(list, () => {
        console.log('done')
      })
      return list
    }
  }
}
