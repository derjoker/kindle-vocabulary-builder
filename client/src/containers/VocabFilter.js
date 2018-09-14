import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
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
import { flatten } from 'lodash'

import { CREATE_LIST, LISTS_QUERY } from '../graphql'

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
    this.state = {
      open: false,
      name: '',
      lang: '',
      title: ''
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
    const { lang } = this.state
    const { classes, filters } = this.props
    const titles = lang ? filters[lang] : flatten(Object.values(filters))

    return (
      <form className={classes.container}>
        <TextField
          select
          label='Lang'
          className={classes.textField}
          value={this.state.lang}
          onChange={event => {
            this.setState({
              lang: event.target.value
            })
          }}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin='normal'
        >
          {Object.keys(filters).map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='Title'
          className={classes.textField}
          value={this.state.title}
          onChange={event => {
            this.setState({
              title: event.target.value,
              name: event.target.value
            })
          }}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin='normal'
        >
          {titles.map(option => (
            <MenuItem key={option.title} value={option.title}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
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
            <Mutation
              mutation={CREATE_LIST}
              update={(cache, { data: { createList } }) => {
                const { lists } = cache.readQuery({
                  query: LISTS_QUERY
                })
                lists.push(createList)
                console.log(lists)
                cache.writeQuery({
                  query: LISTS_QUERY,
                  data: { lists }
                })
              }}
            >
              {createList => (
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
                      createList({
                        variables: { list }
                      })

                      this.setState({
                        open: false
                      })
                    }}
                    color='primary'
                  >
                    Create
                  </Button>
                </div>
              )}
            </Mutation>

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
