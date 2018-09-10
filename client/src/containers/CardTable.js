import React from 'react'
import { Mutation } from 'react-apollo'

import CardTable from '../components/CardTable'

import { UPDATE_CARD } from '../graphql'

export default ({ data }) => (
  <Mutation mutation={UPDATE_CARD}>
    {updateCard => (
      <CardTable
        data={data}
        save={card =>
          updateCard({
            variables: { card }
          })}
      />
    )}
  </Mutation>
)
