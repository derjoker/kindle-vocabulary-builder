import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { Stitch } from 'mongodb-stitch-browser-sdk'

import TextFieldTitle from '../components/TextFieldTitle'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
})

class VocabFilter extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      open: false,
      name: '',
      title: '',
      titles: []
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  componentWillMount () {
    const { lang } = this.props
    this.client.callFunction('titles', [lang]).then(titles => {
      this.setState({
        titles: titles.map(option => ({
          value: option,
          label: option
        }))
      })
    })
  }

  render () {
    const { lang, dict, disabled, search, create } = this.props
    const { name, title, titles } = this.state

    return (
      <form>
        <TextFieldTitle
          title={title}
          options={titles}
          change={option => {
            const title = option.value
            search({ lang, title })
            this.setState({
              title,
              name: title
            })
          }}
        />
        <Button
          disabled={disabled || title === ''}
          onClick={this.handleClickOpen}
        >
          Create List
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
          fullWidth
        >
          <DialogTitle id='form-dialog-title'>List Name</DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.name}
              onChange={event =>
                this.setState({
                  name: event.target.value
                })}
              autoFocus
              margin='dense'
              id='name'
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <div>
              <Button onClick={this.handleClose} color='primary'>
                Cancel
              </Button>
              <Button
                disabled={name === ''}
                onClick={async () => {
                  this.setState({
                    open: false
                  })
                  const list = { lang, dict, title, name }
                  create(list)
                }}
                color='primary'
              >
                Create
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </form>
    )
  }
}

VocabFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.func,
  create: PropTypes.func.isRequired
}

VocabFilter.defaultProps = {
  lang: 'de',
  dict: 'duden'
}

export default withStyles(styles)(VocabFilter)
