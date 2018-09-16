import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Button } from '@material-ui/core'
import stringify from 'csv-stringify'

import { EXPORT_CARDS } from '../graphql'

class CardExporter extends Component {
  render () {
    const { id } = this.props

    return (
      <Mutation
        mutation={EXPORT_CARDS}
        update={(_, { data: { exportCards } }) => {
          stringify(
            exportCards.map(card => {
              const anki = [
                `<h2>${card.word.word}</h2><p>${card.word.example}</p>`,
                `<p>${card.word.definition}</p>`
              ]
              if (card.note) anki.push(`<p>${card.note}</p>`)
              return anki
            }),
            (error, output) => {
              if (error) console.log(error)
              else {
                console.log(output)
                const filename = 'anki.csv'
                const data = encodeURI('data:text/csv;charset=utf-8,' + output)
                const link = document.createElement('a')
                link.setAttribute('href', data)
                link.setAttribute('download', filename)
                link.click()
              }
            }
          )
        }}
      >
        {exportCards => (
          <Button
            onClick={() => {
              exportCards({ variables: { id } })
            }}
          >
            Export
          </Button>
        )}
      </Mutation>
    )
  }
}

export default CardExporter
