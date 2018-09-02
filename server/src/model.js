import { Schema } from 'mongoose'

import connect from './connect'
import Factory from './factory'

const db = connect()

const vocab = Schema({
  _id: { type: String, alias: 'id' },
  usage: String,
  word: String,
  stem: String,
  lang: String,
  title: String
})

export const Vocab = Factory(db, 'Vocab', vocab)
