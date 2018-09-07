import mongoose from 'mongoose'
import uuid from 'uuid/v4'

import connect from './connect'

const db = connect('mongoose')

const linkSchema = mongoose.Schema(
  {
    link: String,
    wordIds: [String]
  },
  { _id: false }
)
const listSchema = mongoose.Schema({
  name: String,
  title: String,
  stems: [String],
  links: [linkSchema]
})
const List = db.model('List', listSchema)

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

  it('findById', async () => {
    const userSchema = mongoose.Schema({
      _id: { type: String, alias: 'id' },
      name: String,
      age: Number
    })
    const User = db.model('User4', userSchema)

    const id = uuid()
    const user = await User.findById(id)
    expect(user).toBeNull()
    const user2 = await User.findByIdAndUpdate(
      id,
      { id, name: 'name' },
      { new: true }
    )
    expect(user2).toBeNull()
  })

  it('model save', async () => {
    const doc = {
      name: 'list',
      stems: [],
      links: []
    }
    const model = new List(doc)
    await model.save()
    const list = await List.findById(model.id)
    expect(list.id).toEqual(model.id)
    expect(list.toJSON().stems).toEqual([])

    list.stems = ['Debatte']
    const model2 = new List(list)
    await model2.save()
    const list2 = await List.findById(model.id)
    expect(list2.id).toEqual(model.id)
    expect(list2.toJSON().stems).toEqual(['Debatte'])

    list2.links = [
      {
        link: 'link',
        wordIds: ['1']
      }
    ]
    const model3 = new List(list2)
    await model3.save()
    const list3 = await List.findById(model.id)
    expect(list3.id).toEqual(model.id)
    expect(list3.toJSON().stems).toEqual(['Debatte'])
    expect(list3.toJSON().links).toEqual([
      {
        link: 'link',
        wordIds: ['1']
      }
    ])

    list3.stems = ['Debatte', 'machen']
    const model4 = new List(list3)
    await model4.save()
    const list4 = await List.findById(model.id)
    expect(list4.id).toEqual(model.id)
    expect(list4.toJSON().stems).toEqual(['Debatte', 'machen'])
    expect(list4.toJSON().links).toEqual([
      {
        link: 'link',
        wordIds: ['1']
      }
    ])

    list4.links = [
      {
        link: 'link',
        wordIds: ['1', '2']
      }
    ]
    const model5 = new List(list4)
    await model5.save()
    const list5 = await List.findById(model.id)
    expect(list5.id).toEqual(model.id)
    expect(list5.toJSON().stems).toEqual(['Debatte', 'machen'])
    expect(list5.toJSON().links).toEqual([
      {
        link: 'link',
        wordIds: ['1', '2']
      }
    ])

    list5.stems = ['tun']
    list5.links = [
      {
        link: 'link',
        wordIds: ['1', '2', '3']
      }
    ]
    const model6 = new List(list5)
    await model6.save()
    const list6 = await List.findById(model.id)
    expect(list6.id).toEqual(model.id)
    expect(list6.toJSON().stems).toEqual(['tun'])
    expect(list6.toJSON().links).toEqual([
      {
        link: 'link',
        wordIds: ['1', '2', '3']
      }
    ])
  })

  it('update', async () => {
    const model = new List({
      name: 'list',
      title: 'title',
      stems: ['machen'],
      links: [
        {
          link: 'link',
          wordIds: ['1']
        }
      ]
    })
    await model.save()

    const doc = {
      id: model.id,
      title: null,
      stems: ['tun'],
      links: [
        {
          link: 'link',
          wordIds: ['1', '3']
        },
        {
          link: 'link2',
          wordIds: ['2']
        }
      ]
    }

    const list2 = await List.findByIdAndUpdate(doc.id, doc, { new: true })
    expect(list2.id).toEqual(doc.id)
    expect(list2.toJSON().stems).toEqual(doc.stems)
    expect(list2.toJSON().links).toEqual(doc.links)
    expect(list2.name).toEqual('list')
    expect(list2.title).toBeNull()
  })
})
