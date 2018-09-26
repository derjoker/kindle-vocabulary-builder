import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import { Stitch, UserPasswordCredential } from 'mongodb-stitch-browser-sdk'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

class Login extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      email: '',
      password: '',
      message: '',
      redirect: false
    }
    this.submit = this.submit.bind(this)
  }

  async submit (event) {
    event.preventDefault()
    const { email, password } = this.state
    const credential = new UserPasswordCredential(email, password)
    try {
      await this.client.auth.loginWithCredential(credential)
      this.setState({
        redirect: true
      })
    } catch (error) {
      this.setState({
        message: error.message
      })
    }
  }

  render () {
    if (this.state.redirect) return <Redirect to='/' />

    const { classes } = this.props

    return (
      <form onSubmit={this.submit}>
        <TextField
          required
          name='email'
          value={this.state.email}
          onChange={event => {
            this.setState({
              email: event.target.value
            })
          }}
          label='Email'
          className={classes.textField}
          type='email'
          margin='normal'
        />
        <TextField
          required
          name='password'
          value={this.state.password}
          onChange={event => {
            this.setState({
              password: event.target.value
            })
          }}
          label='Password'
          className={classes.textField}
          type='password'
          margin='normal'
        />
        <Button type='submit'>Login</Button>
        {this.state.message && <div>{this.state.message}</div>}
      </form>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)
