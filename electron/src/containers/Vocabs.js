import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import isElectron from 'is-electron'
import difference from 'lodash/difference'
import uniq from 'lodash/uniq'

import VocabTable from './VocabTable'
import VocabFilter from './VocabFilter'

class Vocabs extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      vocabs: []
    }
    this.lookup = this.lookup.bind(this)
  }

  async lookup () {
    const { lang, dict } = this.props
    const { vocabs } = this.state
    const stemsInVocabs = uniq(vocabs.map(vocab => vocab.stem))
    const stemsInWords = await this.client.callFunction('stems', [
      lang,
      dict,
      stemsInVocabs
    ])
    const stems = difference(stemsInVocabs, stemsInWords)
    // console.log(stems)
    if (stems.length) window.ipcRenderer.send('lookup', lang, dict, stems)
  }

  componentDidMount () {
    if (isElectron()) {
      window.ipcRenderer.on('lookup-words', async (_, words) => {
        console.log(words)
        const MAX = 100
        for (let offset = 0; offset < words.length; offset += MAX) {
          await this.client.callFunction('insertWords', [
            words.slice(offset, offset + MAX)
          ])
          console.log(offset + MAX)
        }
      })
    }
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <VocabFilter
          disabled={vocabs.length === 0}
          search={condition => {
            this.client.callFunction('vocabs', [condition]).then(vocabs => {
              this.setState({
                vocabs
              })
            })
          }}
          create={async list => {
            list.stems = uniq(vocabs.map(vocab => vocab.stem)).map(stem => ({
              stem
            }))
            console.log(list)
            const result = await this.client.callFunction('createList', [list])
            console.log(result)
          }}
        />
        {isElectron() &&
          vocabs.length > 0 &&
          <Button onClick={this.lookup}>Look Up</Button>}
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

Vocabs.defaultProps = {
  lang: 'de',
  dict: 'duden'
}

export default Vocabs
