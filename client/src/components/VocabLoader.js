import React, { Component } from 'react'
import sql from 'sql.js'
import { differenceBy, zipObject } from 'lodash'

import VocabTable from '../components/VocabTable'

class VocabLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      vocabs: []
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange (event) {
    const file = event.target.files[0]

    if (file.name !== 'vocab.db') return

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

      this.setState({
        vocabs
      })
    }
    reader.readAsBinaryString(file)
    // reader.readAsArrayBuffer(file)
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <div><input type='file' accept='.db' onChange={this.onChange} /></div>
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
