import React, { Component } from 'react'
import { Button } from '@material-ui/core'

import VocabTable from './VocabTable'

const { ipcRenderer } = window.require('electron')

class Kindle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      kindle: false,
      vocabs: []
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

    ipcRenderer.on('kindle-loaded', (_, vocabs) => {
      this.setState({
        vocabs: this.state.vocabs.concat(vocabs)
      })
    })
  }

  render () {
    const { kindle, vocabs } = this.state
    return (
      <div>
        <Button
          disabled={!kindle}
          onClick={() => {
            ipcRenderer.send('kindle-load')
          }}
        >
          Kindle
        </Button>
        <Button>Look Up</Button>
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

export default Kindle
