import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import isElectron from 'is-electron'

import VocabTable from './VocabTable'
import VocabFilter from './VocabFilter'

class Vocabs extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      lang: '',
      vocabs: []
    }
    this.lookup = this.lookup.bind(this)
  }

  async lookup () {
    const { lang, vocabs } = this.state
    const stems = vocabs.map(vocab => vocab.stem)
    const MAX = 10
    for (let offset = 0; offset < stems.length; offset += MAX) {
      console.log(offset)
      const _stems = stems.slice(offset, offset + MAX)
      await this.client.callFunction('insertLinks', [lang, _stems])
      const links = await this.client.callFunction('nilLinks', [lang, _stems])
      window.ipcRenderer.send('lookup', links)
    }
  }

  componentDidMount () {
    if (isElectron()) {
      window.ipcRenderer.on('lookup-links', (_, links) => {
        console.log(links)
        this.client.callFunction('updateLinks', [links])
      })

      window.ipcRenderer.on('lookup-words', (_, words) => {
        console.log(words)
        this.client.callFunction('insertWords', [words])
      })
    }
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <VocabFilter
          search={condition => {
            this.client.callFunction('findVocabs', [condition]).then(vocabs => {
              this.setState({
                lang: condition.lang,
                vocabs
              })
            })
          }}
        />
        <Button onClick={this.lookup}>Look Up</Button>
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

export default Vocabs
