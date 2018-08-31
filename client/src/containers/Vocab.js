import React, { Component } from 'react'
import sql from 'sql.js'
import zipObject from 'lodash/zipObject'

import VocabTable from '../components/VocabTable'

class Vocab extends Component {
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
      const str = String.fromCharCode.apply(null, new Uint8Array(reader.result))
      // const db = new sql.Database(reader.result)
      const db = new sql.Database(str)
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

      this.setState({
        vocabs: result[0].values.map(value =>
          zipObject(result[0].columns, value)
        )
      })
    }
    // reader.readAsBinaryString(file)
    reader.readAsArrayBuffer(file)
  }

  render () {
    const { vocabs } = this.state
    return (
      <div>
        <input type='file' accept='.db' onChange={this.onChange} />
        <br />
        <br />
        <VocabTable data={vocabs} />
      </div>
    )
  }
}

export default Vocab
