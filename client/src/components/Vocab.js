import React, { Component } from 'react'
import sql from 'sql.js'

class Vocab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      values: []
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
      console.log(result)
      db.close()

      this.setState({
        values: result[0].values
      })
    }
    // reader.readAsBinaryString(file)
    reader.readAsArrayBuffer(file)
  }

  render () {
    return (
      <div>
        <input type='file' accept='.db' onChange={this.onChange} />
        <div>Table</div>
        {JSON.stringify(this.state.values)}
      </div>
    )
  }
}

export default Vocab
