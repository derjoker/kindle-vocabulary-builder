import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { Stitch } from 'mongodb-stitch-browser-sdk'

import TextFieldTitle from '../components/TextFieldTitle'

const Langs = ['de']

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
      lang: '',
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

  render () {
    const { lang, title, titles } = this.state
    const { classes } = this.props

    return (
      <form>
        <TextField
          select
          label='Lang'
          className={classes.textField}
          value={lang}
          onChange={event => {
            const lang = event.target.value
            this.setState({
              lang
            })
            this.client.callFunction('titles', [lang]).then(titles => {
              this.setState({
                titles: titles.map(option => ({
                  value: option,
                  label: option
                }))
              })
            })
          }}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin='normal'
        >
          {Langs.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextFieldTitle
          title={title}
          options={titles}
          change={option => {
            const title = option.value
            this.props.search({ lang, title })
            this.setState({
              title,
              name: title
            })
          }}
        />
        <Button onClick={this.handleClickOpen}>Create List</Button>
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
                onClick={() => {
                  const { name, lang, title } = this.state
                  if (name === '') return

                  const list = { name }
                  if (lang) list.lang = lang
                  if (title) list.title = title

                  console.log(list)

                  this.setState({
                    open: false
                  })
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
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VocabFilter)
