import { gql } from 'apollo-server'

import { Vocab } from './model'

export const typeDefs = gql`
type Vocab {
  id: ID!
  usage: String
  word: String
  stem: String
  lang: String
  title: String
}

input VocabInput {
  id: ID
  usage: String
  word: String
  stem: String
  lang: String
  title: String
}

type Query {
  vocabs: [Vocab]
}

type Mutation {
  upsertVocabs (vocabs: [VocabInput]!) : [Vocab]
  updateVocab (vocab: VocabInput!) : Vocab
}
`

export const resolvers = {
  Query: {
    vocabs: () => Vocab.find({})
  },
  Mutation: {
    upsertVocabs: (_, { vocabs }) => Vocab.upsert(vocabs),
    updateVocab: (_, { vocab }) => Vocab.update(vocab)
  }
}
