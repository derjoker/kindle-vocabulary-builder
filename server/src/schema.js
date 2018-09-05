import { gql } from 'apollo-server'

import { Vocab } from './model'

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

# Anki = Word + note + category
type Anki {
  id: ID!
  link: String
  word: String
  example: String
  definition: String
  note: String
  category: String
}

input AnkiInput {
  id: ID!
  wordId: ID!
  note: String
  category: String
}

type Search {
  stem: String!
  links: [String!]
}

input SearchInput {
  stem: String!
  links: [String!]
}

type Link {
  link: String!
  wordIds: [ID!]
}

input LinkInput {
  link: String!
  wordIds: [ID!]
}

type List {
  id: ID!
  name: String!
  lang: String!
  title: String
  stems: [String]
  searches: [Search]
  links: [Link]
  ankiIds: [ID!]
}

input ListInput {
  id: ID!
  name: String
  userId: ID
  lang: String
  title: String
  stems: [String]
  searches: [SearchInput]
  links: [LinkInput]
  ankiIds: [ID!]
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
