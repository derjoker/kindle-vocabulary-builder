import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'

import VocabTable from './VocabTable'

const { ipcRenderer } = window.require('electron')

class Kindle extends Component {
  constructor (props) {
    super(props)
    const client = Stitch.defaultAppClient
    const db = client
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db(process.env.REACT_APP_DB_NAME)
    this.owner_id = client.auth.user.id
    this.Vocab = db.collection('vocabs')
    this.state = {
      vocabs: [],
      ids: []
    }
  }

  componentWillMount () {
    ipcRenderer.send('kindle-load')
  }

  componentDidMount () {
    ipcRenderer.on('kindle-loaded', async (_, vocabs) => {
      const ids = await this.Vocab
        .find({ owner_id: this.owner_id }, { projection: { _id: 1 } })
        .asArray()

      const _vocabs = differenceBy(vocabs, ids, '_id')

      const MAX = 100
      for (let offset = 0; offset < _vocabs.length; offset += MAX) {
        const result = await this.Vocab.insertMany(
          _vocabs.slice(offset, offset + MAX).map(vocab => {
            vocab.owner_id = this.owner_id
            return vocab
          })
        )
        console.log(result)
      }
      this.setState({
        vocabs: this.state.vocabs.concat(_vocabs)
      })
    })
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

export default Kindle
