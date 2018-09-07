import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import { BrowserRouter as Router } from 'react-router-dom'

import Main from './Main'

import 'bootstrap/dist/css/bootstrap.min.css'

const client = new ApolloClient({
  uri: 'http://localhost:4000/'
})

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Main />
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
