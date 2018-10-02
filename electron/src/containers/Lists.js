import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import reject from 'lodash/reject'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
})

class Lists extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      lists: []
    }
  }

  componentWillMount () {
    this.client.callFunction('lists').then(lists => {
      this.setState({ lists })
    })
  }

  render () {
    const { classes } = this.props
    const { lists } = this.state
    return (
      <div className={classes.root}>
        <List component='nav'>
          {lists.map(list => (
            <ListItem
              key={list._id}
              button
              component='a'
              href={`/lists/${list._id}`}
            >
              <ListItemText primary={list.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label='Delete'
                  onClick={() => {
                    const _id = list._id
                    this.client.callFunction('deleteList', [_id])
                    this.setState({
                      lists: reject(this.state.lists, { _id })
                    })
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}

Lists.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Lists)
