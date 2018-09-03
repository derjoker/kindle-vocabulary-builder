import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { pick } from 'lodash'

import VocabDialog from './VocabDialog'

const VOCAB_QUERY = gql`
{
  vocabs {
    id
    usage
    word
    stem
    lang
    title
  }
}
`

class Vocab extends Component {
  render () {
    return (
      <div>
        <Query query={VOCAB_QUERY}>
          {({ loading, error, data }) => {
            console.log(loading, error, data)
            if (loading) return <div>Loading...</div>

            const { vocabs } = data
            const ids = vocabs.map(vocab => pick(vocab, 'id'))

            return (
              <div>
                <VocabDialog ids={ids} />
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Vocab
