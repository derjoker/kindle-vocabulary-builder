import React from 'react'
import { Mutation } from 'react-apollo'
import { reject } from 'lodash'

import VocabTable from '../components/VocabTable'

import { UPDATE_VOCAB, VOCAB_QUERY } from '../graphql'

export default ({ data }) => (
  <Mutation
    mutation={UPDATE_VOCAB}
    update={(cache, { data: { updateVocab } }) => {
      if (updateVocab.delete) {
        const { vocabs } = cache.readQuery({
          query: VOCAB_QUERY
        })
        cache.writeQuery({
          query: VOCAB_QUERY,
          data: { vocabs: reject(vocabs, { id: updateVocab.id }) }
        })
      }
    }}
  >
    {updateVocab => (
      <VocabTable
        data={data}
        save={vocab =>
          updateVocab({
            variables: { vocab }
          })}
      />
    )}
  </Mutation>
)
