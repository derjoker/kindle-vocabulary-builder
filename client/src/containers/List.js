import React, { Component } from 'react'
import { Query } from 'react-apollo'

import ListBuilder from './ListBuilder'
import CardTable from './CardTable'

import { LIST_QUERY } from '../graphql'

class WordList extends Component {
  render () {
    const { id } = this.props.match.params
    return (
      <Query query={LIST_QUERY} variables={{ id }}>
        {({ loading, data }) => {
          console.log(data)
          if (loading) return <div />

          const { lang, title, stems, cards } = data.list

          return (
            <div>
              <ListBuilder id={id} />
              <div>{lang}</div>
              <div>{title}</div>
              <div>stems: {stems.length}</div>
              <div>cards: {cards.length}</div>
              <CardTable data={cards} />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default WordList
