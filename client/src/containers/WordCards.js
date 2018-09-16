import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { find } from 'lodash'

import WordCard from '../components/WordCard'

import { LIST_CARDS_QUERY, UPDATE_CARD } from '../graphql'

class WordCards extends Component {
  constructor (props) {
    super(props)
    const { count } = this.props
    this.limit = Math.min(100, count)
    this.state = {
      index: 0
    }
    this.next = this.next.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
  }

  next () {
    const limit = this.limit
    const { index } = this.state
    if (index < limit - 1) {
      this.setState({
        index: index + 1
      })
    } else {
      this.refetch()
      this.setState({
        index: 0
      })
    }
  }

  onKeydown (event) {
    // console.log(event)
    if (event.target.nodeName === 'INPUT') return

    switch (event.key) {
      case 'j':
        this.next()
        break
      case 'k':
        if (this.state.index > 0) {
          this.setState({
            index: this.state.index - 1
          })
        }
        break
      default:
        break
    }
  }

  componentWillMount () {
    document.body.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.onKeydown)
  }

  render () {
    const limit = this.limit
    const { id } = this.props
    const { index } = this.state

    return (
      <Query query={LIST_CARDS_QUERY} variables={{ id, limit }}>
        {({ loading, data, refetch }) => {
          this.refetch = refetch

          // console.log(data)
          if (loading) return <div />

          const { listCards } = data

          const card = listCards[index]
          // console.log(index, card)
          if (!card) return <div>No Cards Found!</div>

          return (
            <Mutation mutation={UPDATE_CARD}>
              {updateCard => (
                <WordCard
                  card={card}
                  next={this.next}
                  save={card =>
                    updateCard({
                      variables: { card },
                      optimisticResponse: {
                        updateCard: {
                          ...find(listCards, { id: card.id }),
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

export default WordCards
