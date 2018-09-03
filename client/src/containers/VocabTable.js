import React from 'react'
import { Mutation } from 'react-apollo'

import VocabTable from '../components/VocabTable'

import { UPDATE_VOCAB } from '../graphql'

export default ({ data }) => (
  <Mutation mutation={UPDATE_VOCAB}>
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
