import React, { Component } from 'react'
import { Query } from 'react-apollo'

import ListBuilder from './ListBuilder'
import CardExporter from './CardExporter'
import WordCards from './WordCards'

import { LIST_QUERY } from '../graphql'

class WordList extends Component {
  render () {
    const { id } = this.props.match.params
    return (
      <div>
        <ListBuilder id={id} />
        <CardExporter id={id} />
        <Query query={LIST_QUERY} variables={{ id }}>
          {({ loading, data }) => {
            console.log(data)
            if (loading) return <div />

            const { lang, title, stems, count } = data.list

            return (
              <div>
                <div>{lang}</div>
                <div>{title}</div>
                <div>stems: {stems.length}</div>
                <div>cards: {count}</div>
                <WordCards id={id} count={count} />
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default WordList
