import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import isElectron from 'is-electron'

import Auth from './containers/Auth'
import Vocabs from './containers/Vocabs'
import Kindle from './containers/Kindle'
import Login from './containers/Login'

const Play = () => <div>Play</div>
const Search = () => <div>Search</div>
const Lists = () => <div>Lists</div>

Stitch.initializeDefaultAppClient(process.env.REACT_APP_STITCH_APP_KEY)

const drawerWidth = 180

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  drawerPaper: {
    position: 'fixed',
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    marginLeft: drawerWidth,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
})

class Main extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      isAuthed: this.client.auth.isLoggedIn,
      kindle: false
    }
  }

  componentWillMount () {
    const kindles = isElectron() ? window.ipcRenderer.sendSync('kindles') : 0
    this.setState({
      kindle: kindles > 0
    })
  }

  componentDidMount () {
    if (isElectron()) {
      window.ipcRenderer.on('kindles', (_, kindles) => {
        this.setState({
          kindle: kindles > 0
        })
      })
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              disabled
              className={classes.menuButton}
              color='inherit'
              aria-label='Home'
            >
              <HomeIcon />
            </IconButton>
            <Typography
              variant='title'
              color='inherit'
              className={classes.grow}
              noWrap
            >
              Kindle Vocabulary Builder
            </Typography>
            <Auth />
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem component={Link} to={'/play'} button>
              <ListItemText primary='Play' />
            </ListItem>
          </List>
          <List>
            <ListItem component={Link} to={'/search'} button>
              <ListItemText primary='Search' />
            </ListItem>
          </List>
          <List>
            <ListItem component={Link} to={'/lists'} button>
              <ListItemText primary='Lists' />
            </ListItem>
          </List>
          <List>
            <ListItem component={Link} to={'/vocabs'} button>
              <ListItemText primary='Vocabs' />
            </ListItem>
          </List>
          {this.state.kindle &&
            <List>
              <ListItem component={Link} to={'/kindle'} button>
                <ListItemText primary='Kindle' />
              </ListItem>
            </List>}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route exact path='/' component={Play} />
          <Route path='/play' component={Play} />
          <Route path='/search' component={Search} />
          <Route path='/lists' component={Lists} />
          <Route path='/vocabs' component={Vocabs} />
          {isElectron() && <Route path='/kindle' component={Kindle} />}
          <Route path='/login' component={Login} />
        </main>
      </div>
    )
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Main)
