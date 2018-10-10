import React from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import CloseIcon from '@material-ui/icons/Close'

import VocabTable from './VocabTable'

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

class Book extends React.Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      vocabs: []
    }
  }

  componentWillMount () {
    const { lang, title } = this.props
    this.client.callFunction('vocabs', [{ lang, title }]).then(vocabs => {
      this.setState({
        vocabs
      })
    })
  }

  render () {
    const { classes, title, close } = this.props
    const { vocabs } = this.state
    return (
      <Dialog open fullScreen onClose={close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              variant='title'
              color='inherit'
              className={classes.flex}
            >
              {title}
            </Typography>
            <IconButton color='inherit' onClick={close} aria-label='Close'>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <VocabTable data={vocabs} />
      </Dialog>
    )
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Book)
