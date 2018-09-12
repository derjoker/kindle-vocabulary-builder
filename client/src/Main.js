import React from 'react'
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
  Typography,
  Divider
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'

import Vocab from './containers/Vocab'
import Lists from './containers/Lists'
import WordList from './containers/List'

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
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

function Main (props) {
  const { classes } = props

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            component={Link}
            to='/'
            className={classes.menuButton}
            color='inherit'
            aria-label='Home'
          >
            <HomeIcon />
          </IconButton>
          <Typography variant='title' color='inherit' noWrap>
            Kindle Vocabulary Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <Lists />
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary='Find More' />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route exact path='/' component={Vocab} />
        <Route path='/lists/:id' component={WordList} />
      </main>
    </div>
  )
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Main)
