import React from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import isElectron from 'is-electron'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import CloseIcon from '@material-ui/icons/Close'
import uniq from 'lodash/uniq'
import difference from 'lodash/difference'

import VocabTableLite from './VocabTableLite'

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
      vocabs: [],
      building: false
    }
    this.build = this.build.bind(this)
  }

  async build () {
    const { lang, dict, title } = this.props
    const { vocabs } = this.state
    const stems = uniq(vocabs.map(vocab => vocab.stem))
    const list = {
      lang,
      dict,
      title,
      stems
    }
    // update list stems
    const listId = await this.client.callFunction('upsertList', [list])
    // look up words
    if (isElectron()) {
      const stemsInWords = await this.client.callFunction('stems', [
        lang,
        dict,
        stems
      ])
      console.log(stemsInWords)
      const stemsToLookup = difference(stems, stemsInWords)
      if (stemsToLookup.length) {
        this.setState({ building: true })
        console.log(stemsToLookup)
        window.ipcRenderer.send('lookup', lang, dict, stemsToLookup)
      }
    }
    // copy words to notes
    // add/delete list_id
    console.log(listId)
  }

  componentWillMount () {
    const { lang, title } = this.props
    this.client.callFunction('vocabs', [{ lang, title }]).then(vocabs => {
      this.setState({
        vocabs
      })
    })
  }

  componentDidMount () {
    if (isElectron()) {
      window.ipcRenderer.on('lookup-words', async (_, words) => {
        console.log(words)
        const MAX = 100
        for (let offset = 0; offset < words.length; offset += MAX) {
          await this.client.callFunction('insertWords', [
            words.slice(offset, offset + MAX)
          ])
          console.log(offset + MAX)
          if (offset + MAX >= words.length) {
            this.setState({ building: false })
          }
        }
        // TODO: copy words to notes & add list_id
      })
    }
  }

  render () {
    const { classes, title, close } = this.props
    const { vocabs, building } = this.state
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
        <Button disabled={vocabs.length === 0} onClick={this.build}>
          Build
        </Button>
        <Fade
          in={building}
          style={{
            transitionDelay: building ? '800ms' : '0ms'
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
        <VocabTableLite
          data={vocabs}
          save={(_id, vocab) => {
            console.log(_id, vocab)
            this.client.callFunction('updateVocab', [_id, vocab])
          }}
        />
      </Dialog>
    )
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Book)
