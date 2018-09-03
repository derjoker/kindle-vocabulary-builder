import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import VocabLoader from './VocabLoader'

const styles = {
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
}

function Transition (props) {
  return <Slide direction='up' {...props} />
}

class FullScreenDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
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
    const { classes, ids } = this.props
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Kindle</Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color='inherit'
                onClick={this.handleClose}
                aria-label='Close'
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant='title'
                color='inherit'
                className={classes.flex}
              >
                Kindle
              </Typography>
              <Button color='inherit' onClick={this.handleClose}>
                close
              </Button>
            </Toolbar>
          </AppBar>
          <VocabLoader ids={ids} />
        </Dialog>
      </div>
    )
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FullScreenDialog)
