import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { TextField } from '@material-ui/core'
import { debounce } from 'lodash'

import WordTable from '../components/WordTable'

import { WORDS_QUERY } from '../graphql'

class Search extends Component {
  constructor (props) {
    super(props)
    this.debounced = debounce(() => {
      this.setState({
        text: this.state.value
      })
    }, 500)
    this.state = {
      value: '',
      text: ''
    }
  }

  render () {
    const { value, text } = this.state
    // console.log(value, text)
    return (
      <div>
        <TextField
          value={value}
          onChange={event => {
            this.setState({
              value: event.target.value
            })
            this.debounced()
          }}
          autoFocus
          fullWidth
        />
        <Query query={WORDS_QUERY} variables={{ text }}>
          {({ loading, data }) => {
            console.log(data)
            if (loading) return <div />

            const { words } = data
            return <WordTable data={words} />
          }}
        </Query>
      </div>
    )
  }
}

export default Search
