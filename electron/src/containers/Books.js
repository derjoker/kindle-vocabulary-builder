import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
})

class Books extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      open: false,
      title: '',
      titles: new Set()
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
        titles: new Set(titles)
      })
    })
  }

  render () {
    const { classes } = this.props
    const { title, titles } = this.state
    return (
      <div className={classes.root}>
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Edit Title</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='title'
              label='Title'
              defaultValue={title}
              onChange={event => {
                this.setState({
                  edit: event.target.value
                })
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.client
                  .callFunction('updateTitle', [title, this.state.edit])
                  .then(result => {
                    if (result.modifiedCount) {
                      titles.delete(title)
                      titles.add(this.state.edit)
                      this.setState({
                        open: false,
                        titles
                      })
                    }
                  })
              }}
              color='primary'
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {Array.from(titles).map(title => (
          <div key={title}>
            <List component='nav'>
              <ListItem>
                <ListItemText primary={title} />
                <Button
                  onClick={() => {
                    console.log('button', title)
                  }}
                >
                  List
                </Button>
                <Button
                  onClick={() => {
                    this.setState({
                      title,
                      open: true
                    })
                  }}
                >
                  Edit
                </Button>
              </ListItem>
            </List>
            <Divider />
          </div>
        ))}
      </div>
    )
  }
}

Books.propTypes = {
  classes: PropTypes.object.isRequired
}

Books.defaultProps = {
  lang: 'de'
}

export default withStyles(styles)(Books)
