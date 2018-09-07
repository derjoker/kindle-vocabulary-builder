import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { pick } from 'lodash'

import VocabDialog from './VocabDialog'
import VocabTable from './VocabTable'

import { VOCAB_QUERY } from '../graphql'

class Vocab extends Component {
  render () {
    return (
      <div>
        <Query query={VOCAB_QUERY}>
          {({ loading, data }) => {
            if (loading) return <div />

            const { vocabs } = data
            const ids = vocabs.map(vocab => pick(vocab, 'id'))

            return (
              <div>
                <VocabDialog ids={ids} />
                <br />
                <VocabTable data={vocabs} />
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Vocab
