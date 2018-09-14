import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { find } from 'lodash'

import CardTable from '../components/CardTable'

import { LIST_CARDS_QUERY, UPDATE_CARD } from '../graphql'

class CardTableContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 0,
      limit: 100
    }
  }

  render () {
    const { offset, limit } = this.state
    const { id, count } = this.props
    return (
      <Query query={LIST_CARDS_QUERY} variables={{ id, offset, limit }}>
        {({ loading, data }) => {
          console.log(data)
          if (loading) return <div />

          const { listCards } = data

          return (
            <Mutation mutation={UPDATE_CARD}>
              {updateCard => (
                <CardTable
                  data={listCards}
                  count={count}
                  page={offset}
                  rowsPerPage={limit}
                  onChangePage={page => {
                    this.setState({
                      offset: page
                    })
                  }}
                  save={card =>
                    updateCard({
                      variables: { card },
                      optimisticResponse: {
                        updateCard: {
                          ...find(data, { id: card.id }),
                          ...card
                        }
                      }
                    })}
                />
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default CardTableContainer
