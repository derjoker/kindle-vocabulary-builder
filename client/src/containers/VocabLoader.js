import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import sql from 'sql.js'
import { differenceBy, zipObject } from 'lodash'

import VocabTable from '../components/VocabTable'

const UPSERT_VOCABS = gql`
mutation upsertVocabs ($vocabs: [VocabInput]!) {
  upsertVocabs (vocabs: $vocabs) {
    id
    usage
    word
    stem
    lang
    title
  }
}
`

class VocabLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      vocabs: []
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange (event, upsertVocabs) {
    const file = event.target.files[0]

    if (!file || file.name !== 'vocab.db') return

    /* global FileReader */
    const reader = new FileReader()
    reader.onload = () => {
      // console.log(reader.result)

      const db = new sql.Database(reader.result)

      // const str = String.fromCharCode.apply(null, new Uint8Array(reader.result))
      // const db = new sql.Database(str)

      const result = db.exec(
        `
        SELECT LOOKUPS.id, LOOKUPS.usage, WORDS.word, WORDS.stem, WORDS.lang, BOOK_INFO.title FROM LOOKUPS
        JOIN WORDS
        ON LOOKUPS.word_key = WORDS.id
        JOIN BOOK_INFO
        ON LOOKUPS.book_key = BOOK_INFO.id
      `
      )
      db.close()

      const { ids } = this.props
      const vocabs = differenceBy(
        result[0].values.map(value => zipObject(result[0].columns, value)),
        ids,
        'id'
      )

      if (vocabs.length > 0) {
        upsertVocabs({
          variables: { vocabs }
        })
      }
    }
    reader.readAsBinaryString(file)
    // reader.readAsArrayBuffer(file)
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <div>
          <Mutation
            mutation={UPSERT_VOCABS}
            update={(_, { data: { upsertVocabs } }) => {
              this.setState({
                vocabs: upsertVocabs
              })
            }}
          >
            {upsertVocabs => (
              <div>
                <input
                  type='file'
                  accept='.db'
                  onChange={event => this.onChange(event, upsertVocabs)}
                />
                <button>Build</button>
              </div>
            )}
          </Mutation>
        </div>
        <br />
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

VocabLoader.defaultProps = {
  ids: []
}

export default VocabLoader
