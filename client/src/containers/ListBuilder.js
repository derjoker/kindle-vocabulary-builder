import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Button, CircularProgress, Fade } from '@material-ui/core'

import { UPDATE_STEMS } from '../graphql'

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
    const { id } = this.props
    const { loading } = this.state

    return (
      <Mutation
        mutation={UPDATE_STEMS}
        update={() => {
          this.setState({
            loading: false
          })
        }}
      >
        {updateStems => (
          <div>
            <div>
              <Button
                onClick={() => {
                  updateStems({ variables: { id } })
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
