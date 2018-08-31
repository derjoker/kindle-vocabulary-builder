import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

import Vocab from './containers/Vocab'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const client = new ApolloClient({
  uri: 'https://api-apeast.graphcms.com/v1/cjlhe8jkd007i01aw651wry1e/master'
})

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <div className='App'>
          <h2>Kindle Vocabulary Builder</h2>
          <Vocab />
        </div>
      </ApolloProvider>
    )
  }
}

export default App
