import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import isElectron from 'is-electron'

import VocabTable from './VocabTable'

class Kindle extends Component {
  constructor (props) {
    super(props)
    const client = Stitch.defaultAppClient
    const db = client
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db(process.env.REACT_APP_DB_NAME)
    this.user_id = client.auth.user.id
    this.Vocab = db.collection('vocabs')
    this.state = {
      vocabs: [],
      ids: []
    }
  }

  componentWillMount () {
    if (isElectron() && window.ipcRenderer.sendSync('kindles')) { window.ipcRenderer.send('kindle-load') }
  }

  componentDidMount () {
    if (isElectron()) {
      window.ipcRenderer.on('kindle-loaded', async (_, _vocabs) => {
        const ids = await this.Vocab
          .find({ user_id: this.user_id }, { projection: { _id: 1 } })
          .asArray()

        const vocabs = differenceBy(_vocabs, ids, '_id')

        this.setState({
          vocabs
        })

        const MAX = 100
        for (let offset = 0; offset < vocabs.length; offset += MAX) {
          const result = await this.Vocab.insertMany(
            vocabs.slice(offset, offset + MAX).map(vocab => {
              vocab.user_id = this.user_id
              return vocab
            })
          )
          console.log(result)
        }
      })
    }
  }

  render () {
    return (
      <div>
        <VocabTable data={this.state.vocabs} />
      </div>
    )
  }
}

export default Kindle
