import { Schema } from 'mongoose'

import connect from './connect'
import Factory from './factory'

const db = connect()

const user = Schema({
  _id: { type: String, alias: 'id' }, // hash(email)
  email: { type: String, trim: true },
  name: String
})

export const User = Factory(db, 'User', user)

const vocab = Schema({
  _id: { type: String, alias: 'id' },
  // userId: { type: String, alias: 'id' },
  usage: String,
  word: String,
  stem: String,
  lang: String,
  title: String,
  build: Boolean,
  links: [String],
  delete: Boolean
})

export const Vocab = Factory(db, 'Vocab', vocab)

const word = Schema({
  _id: { type: String, alias: 'id' }, // hash({link, word, example, definition})
  link: String,
  word: String,
  example: String,
  definition: String
})

export const Word = Factory(db, 'Word', word)

// cardId = wordId
const card = Schema({
  _id: { type: String, alias: 'id' }, // wordId, TODO: hash({userId, wordId})
  wordId: String,
  note: String,
  category: String
})

export const Card = Factory(db, 'Card', card)

const list = Schema({
  name: String,
  // userId: String,
  lang: String,
  title: String,
  filter: String,
  stems: [String],
  searches: [
    {
      stem: String,
      links: [String]
    }
  ],
  cardIds: [String]
})

export const List = Factory(db, 'List', list)
