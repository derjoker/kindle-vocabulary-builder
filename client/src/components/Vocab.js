import React, { Component } from 'react'
import sql from 'sql.js'

class Vocab extends Component {
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
      const words = db.exec('SELECT * from WORDS')
      console.log(words)
      db.close()
    }
    // reader.readAsBinaryString(file)
    reader.readAsArrayBuffer(file)
  }

  render () {
    return (
      <div>
        <input type='file' accept='.db' onChange={this.onChange} />
        <div>Table</div>
      </div>
    )
  }
}

export default Vocab
