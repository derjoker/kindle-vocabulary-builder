import mongoose from 'mongoose'
import { pick } from 'lodash'
import uuid from 'uuid/v4'

import connect from './connect'
import Factory from './factory'

const db = connect('factory')

const user = mongoose.Schema({
  name: { type: String, trim: true },
  email: String,
  address: { type: String, trim: true },
  age: Number
})

const User = Factory(db, 'User', user, ['name', 'email'])

const post = mongoose.Schema({
  _id: { type: String, alias: 'id' },
  title: String,
  comment: String
})

const Post = Factory(db, 'Post', post)

describe('factory', () => {
  it('runs', () => {
    User.find({})
  })

  it('insert doc', async () => {
    const doc = {
      name: 'insert-' + uuid(),
      email: 'insert@mail.com',
      address: 'address',
      age: 27
    }
    const user1 = await User.upsert(doc)
    expect(user1.id).toBeDefined()
    expect(pick(user1, ['name', 'email', 'address', 'age'])).toEqual(doc)
  })

  it('insert doc (id)', async () => {
    const doc = {
      id: uuid(),
      title: 'title',
      comment: 'comment'
    }
    const post1 = await Post.upsert(doc)
    expect(post1._id).toEqual(doc.id)
    expect(post1.id).toEqual(doc.id)
    expect(pick(post1, ['id', 'title', 'comment'])).toEqual(doc)
  })

  it('insert docs', async () => {
    const docs = [
      {
        name: 'insert' + uuid(),
        email: 'insert@mail.com',
        address: 'address',
        age: 27
      },
      {
        name: 'insert' + uuid(),
        email: 'insert@mail.com',
        address: 'address',
        age: 28
      }
    ]
    const users = await User.upsert(docs)
    expect(users[0].id).toBeDefined()
    expect(users[1].id).toBeDefined()
    expect(
      users.map(user => pick(user, ['name', 'email', 'address', 'age']))
    ).toEqual(docs)
  })

  it('upsert doc (safe), database as defaults', async () => {
    const name = 'upsert' + uuid()
    const email = 'upsert@mail.com'
    const doc = {
      name,
      email,
      age: 27
    }
    const user1 = await User.upsert(doc)
    expect(user1.age).toEqual(27)
    const user2 = await User.upsert({
      name,
      email,
      address: 'address',
      age: 28
    })
    expect(user2.id).toEqual(user1.id)
    expect(user2.address).toEqual('address')
    expect(user2.age).toEqual(27)
  })

  it('upsert docs (safe), database as defaults', async () => {
    const doc = {
      name: 'upsert' + uuid(),
      email: 'upsert@mail.com'
    }
    const docs = [{ ...doc, age: 27 }, { ...doc, age: 28 }]
    const users = await User.upsert(docs)
    expect(users[0].toJSON()).toEqual(users[1].toJSON())
    expect(users[1].age).toEqual(27)
  })

  it('update doc, including index fields (e.g. email)', async () => {
    const doc = {
      name: 'insert-' + uuid(),
      email: 'insert@mail.com',
      address: 'address',
      age: 27
    }
    const user1 = await User.upsert(doc)
    const user2 = await User.update({
      ...user1.toJSON(),
      email: 'new@mail.com',
      age: 28
    })
    expect(user2.email).toEqual('new@mail.com')
    expect(user2.age).toEqual(28)
  })

  it('fecth', async () => {
    const docs = [
      { name: 'fetch-' + uuid(), email: 'fetch@mail.com' },
      { name: 'fetch-' + uuid(), email: 'fetch@mail.com' },
      { name: 'fetch-' + uuid(), email: 'fetch@mail.com' }
    ]
    const users1 = await User.upsert(docs)
    const ids = users1.map(user => user.id)
    const users2 = await User.fetch(ids)
    expect(users2.map(user => user.toJSON())).toEqual(
      users1.map(user => user.toJSON())
    )
  })
})
