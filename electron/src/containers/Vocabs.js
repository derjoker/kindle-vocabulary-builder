import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Stitch } from 'mongodb-stitch-browser-sdk'

import VocabTable from './VocabTable'
import VocabFilter from './VocabFilter'

const { ipcRenderer } = window.require('electron')

class Vocabs extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      kindle: false,
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
      ipcRenderer.send('lookup', links)
    }
  }

  componentWillMount () {
    const kindles = ipcRenderer.sendSync('kindles')
    this.setState({
      kindle: kindles > 0
    })
  }

  componentDidMount () {
    ipcRenderer.on('kindles', (_, kindles) => {
      this.setState({
        kindle: kindles > 0
      })
    })

    ipcRenderer.on('lookup-links', (_, links) => {
      console.log(links)
      this.client.callFunction('updateLinks', [links])
    })

    ipcRenderer.on('lookup-words', (_, words) => {
      console.log(words)
      this.client.callFunction('insertWords', [words])
    })
  }

  render () {
    const { kindle, vocabs } = this.state
    return (
      <div>
        <Button disabled={!kindle} component={Link} to='/vocabs/kindle'>
          Kindle
        </Button>
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
