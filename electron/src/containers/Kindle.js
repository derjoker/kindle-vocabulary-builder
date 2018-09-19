import React, { Component } from 'react'

const { ipcRenderer } = window.require('electron')

class Kindle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      kindle: false
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

    ipcRenderer.on('kindle-loaded', (event, arg) => {
      console.log(event, arg)
    })
  }

  render () {
    const { kindle } = this.state
    return (
      <div>
        <p>Vocabs</p>
        <button
          disabled={!kindle}
          onClick={() => {
            ipcRenderer.send('kindle-load')
          }}
        >
          Kindle
        </button>
      </div>
    )
  }
}

export default Kindle
