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
  title: String
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

// ankiId = wordId
const anki = Schema({
  _id: { type: String, alias: 'id' }, // wordId, TODO: hash({userId, wordId})
  wordId: { type: String, alias: 'id' },
  note: String,
  category: String
})

export const Anki = Factory(db, 'Anki', anki)

const list = Schema({
  _id: { type: String, alias: 'id' },
  name: String,
  // userId: { type: String, alias: 'id' },
  lang: String,
  title: String,
  stems: [String],
  searches: [
    {
      stem: String,
      links: [String]
    }
  ],
  links: [
    {
      link: String,
      wordIds: [String]
    }
  ],
  ankiIds: [String]
})

export const List = Factory(db, 'List', list)
