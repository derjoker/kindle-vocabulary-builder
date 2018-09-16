import { gql } from 'apollo-server'
import { uniq, flatten, sampleSize } from 'lodash'
import hash from 'object-hash'

import { Vocab, Word, Card, List } from './model'
import build from './lang/build'

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
  build: Boolean
  links: [String!]
  delete: Boolean
}

input VocabInput {
  id: ID!
  # userId: ID
  usage: String
  word: String
  stem: String
  lang: String
  title: String
  build: Boolean
  links: [String!]
  delete: Boolean
}

type Word {
  id: ID!
  link: String
  word: String
  example: String
  definition: String
  text: String
}

enum Category {
  EASY
  LEARN
  STAGED
  HARD
  DELETE
}

# Card = Word + note + category
type Card {
  id: ID!
  word: Word
  note: String
  category: String
}

input CardInput {
  id: ID
  wordId: ID
  note: String
  category: String
}

type List {
  id: ID!
  name: String!
  lang: String
  title: String
  filter: String
  stems: [String]
  count: Int
}

input ListInput {
  id: ID
  name: String
  userId: ID
  lang: String
  title: String
  filter: String
}

type Query {
  vocabs: [Vocab]
  vocabIds: [ID!]
  words (text: String!): [Word]
  lists: [List]
  list (id: ID!): List
  listCards (id: ID!, limit: Int): [Card]
  listCardsOld (id: ID!, offset: Int, limit: Int): [Card]
}

type Mutation {
  upsertVocabs (vocabs: [VocabInput]!) : [Vocab]
  updateVocab (vocab: VocabInput!) : Vocab
  buildVocabs: [Vocab]
  updateCard (card: CardInput!) : Card
  exportCards (id: ID!) : [Card]
  createList (list: ListInput!) : List
  updateStems (id: ID!) : List
}
`

export const resolvers = {
  Query: {
    vocabs: () => Vocab.find({ delete: { $ne: true } }),
    vocabIds: async () => {
      const vocabs = await Vocab.find({})
      return vocabs.map(vocab => vocab.id)
    },
    words: (_, { text }) =>
      Word.find({ text: { $regex: text, $options: 'i' } }).limit(100),
    lists: () => List.find({}),
    list: (_, { id }) => List.findById(id),
    listCards: async (_, { id, limit = 100 }) => {
      const list = await List.findById(id)
      return Card.fetch(sampleSize(list.cardIds, limit))
    },
    listCardsOld: async (_, { id, offset, limit }) => {
      const list = await List.findById(id)
      return Card.fetch(list.cardIds.slice(offset, offset + limit))
    }
  },
  List: {
    count: list => list.cardIds.length
  },
  Card: {
    word: card => Word.findById(card.wordId)
  },
  Mutation: {
    upsertVocabs: (_, { vocabs }) => Vocab.upsert(vocabs),
    updateVocab: (_, { vocab }) => Vocab.update(vocab),
    buildVocabs: async () => {
      const vocabs = await Vocab.find({
        delete: { $ne: true },
        build: { $ne: true }
      })
      // console.log(vocabs)
      build(vocabs)
      return vocabs
    },
    updateCard: (_, { card }) => Card.update(card),
    exportCards: async (_, { id }) => {
      const list = await List.findById(id)
      const cards = await Card.fetch(list.cardIds)
      const _cards = cards
        .filter(card => card.category === 'LEARN')
        .map(card => {
          card.category = 'STAGED'
          return card
        })
      return Card.update(_cards)
    },
    createList: (_, { list }) => List.upsert(list),
    updateStems: async (_, { id }) => {
      const list = await List.findById(id)
      const condition = {
        delete: { $ne: true }
      }
      if (list.lang) condition.lang = list.lang
      if (list.title) condition.title = list.title
      const vocabs = await Vocab.find(condition)
      const stems = uniq(vocabs.map(vocab => vocab.stem))
      list.stems = stems
      const links = uniq(flatten(vocabs.map(vocab => vocab.links)))
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
      return List.update(list)
    }
  }
}
