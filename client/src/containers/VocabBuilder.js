import React, { Component } from 'react'
import { Button, CircularProgress, Fade } from '@material-ui/core'

class VocabBuilder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.setState(state => ({
      loading: !this.state.loading
    }))
  }

  render () {
    const { loading } = this.state
    return (
      <div>
        <div>
          <Button onClick={this.onClick}>
            {loading ? 'Building' : 'Build'}
          </Button>
        </div>
        <div>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms'
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </div>
      </div>
    )
  }
}

export default VocabBuilder
