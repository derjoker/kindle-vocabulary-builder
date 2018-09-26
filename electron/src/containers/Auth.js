import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { Stitch } from 'mongodb-stitch-browser-sdk'

class Auth extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      isAuthed: this.client.auth.isLoggedIn
    }
  }

  render () {
    if (this.state.isAuthed) {
      return (
        <Button
          color='inherit'
          onClick={() => {
            this.client.auth.logout()
            this.setState({
              isAuthed: false
            })
          }}
        >
          Logout
        </Button>
      )
    } else {
      return (
        <Button color='inherit' component={Link} to={'/login'}>
          Login
        </Button>
      )
    }
  }
}

export default Auth
