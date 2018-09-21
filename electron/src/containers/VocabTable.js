import React, { Component } from 'react'

import VocabTable from '../components/VocabTable'

class VocabTableContainer extends Component {
  render () {
    const { data } = this.props
    return (
      <VocabTable
        data={data}
        save={vocab => {
          console.log(vocab)
        }}
      />
    )
  }
}

export default VocabTableContainer
