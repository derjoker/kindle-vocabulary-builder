import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Button, CircularProgress, Fade } from '@material-ui/core'

import { BUILD_VOCABS } from '../graphql'

class VocabBuilder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.setState({
      loading: !this.state.loading
    })
  }

  render () {
    const { loading } = this.state

    return (
      <Mutation
        mutation={BUILD_VOCABS}
        update={() => {
          this.setState({
            loading: false
          })
        }}
      >
        {buildVocabs => (
          <div>
            <div>
              <Button
                onClick={() => {
                  buildVocabs()
                }}
              >
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
        )}
      </Mutation>
    )
  }
}

export default VocabBuilder
