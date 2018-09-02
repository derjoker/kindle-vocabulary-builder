import mongoose from 'mongoose'

import connect from './connect'

const db = connect('mongoose')

describe('mongoose', () => {
  it('_id/id (ObjectId)', () => {
    const userSchema = mongoose.Schema({
      name: String,
      age: Number
    })

    const User = db.model('User1', userSchema)

    const user1 = new User({
      name: 'user1',
      age: 27
    })
    expect(user1._id).toBeDefined()
    expect(user1.id).toBeDefined()
    // ObjectId vs. String
    expect(user1._id).not.toEqual(user1.id)
    expect(user1._id.toString()).toEqual(user1.id)

    const user2 = new User({
      id: '5b8ac45cd7b33115d5619e06', // skipped
      name: 'user2',
      age: 27
    })
    expect(user2._id.toString()).not.toEqual('5b8ac45cd7b33115d5619e06')
    expect(user2.id).not.toEqual('5b8ac45cd7b33115d5619e06')

    const user3 = new User({
      _id: '5b8ac45cd7b33115d5619e06', // used
      name: 'user3',
      age: 27
    })
    expect(user3._id.toString()).toEqual('5b8ac45cd7b33115d5619e06')
    expect(user3.id).toEqual('5b8ac45cd7b33115d5619e06')
  })

  it('_id/id (String)', () => {
    const userSchema = mongoose.Schema({
      _id: { type: String, alias: 'id' },
      name: String,
      age: Number
    })

    const User = db.model('User2', userSchema)

    // should be avoided, because no `id` defined
    const user1 = new User({
      name: 'user1',
      age: 27
    })
    expect(user1._id).toBeUndefined()
    expect(user1.id).toBeUndefined()

    const user2 = new User({
      id: '123',
      name: 'user2',
      age: 27
    })
    expect(user2._id).toEqual('123')
    expect(user2.id).toEqual('123')

    const user3 = new User({
      _id: '123',
      name: 'user3',
      age: 27
    })
    expect(user3._id).toEqual('123')
    expect(user3.id).toEqual('123')
  })

  it('duplicate key error (model save)', done => {
    const userSchema = mongoose.Schema({
      _id: { type: String, alias: 'id' },
      name: String,
      age: Number
    })

    const User = db.model('User3', userSchema)

    const user1 = new User({
      id: '123',
      name: 'user1',
      age: 27
    })
    user1.save().catch(() => {})
    const user2 = new User({
      id: '123',
      name: 'user2',
      age: 28
    })
    user2.save().catch(error => {
      expect(error.toString()).toMatch(/E11000 duplicate key error/)
      done()
    })
  })
})
