import React, { Component } from 'react'

import Vocab from './containers/Vocab'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <h2>Kindle Vocabulary Builder</h2>
        <Vocab />
      </div>
    )
  }
}

export default App
