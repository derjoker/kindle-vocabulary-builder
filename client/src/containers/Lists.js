import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { List, ListItem, ListItemText } from '@material-ui/core'

import { LISTS_QUERY } from '../graphql'

class Lists extends Component {
  render () {
    return (
      <Query query={LISTS_QUERY}>
        {({ loading, data }) => {
          if (loading) return <div />

          return (
            <List>
              {data.lists.map(list => (
                <ListItem
                  key={list.id}
                  component={Link}
                  to={`/lists/${list.id}`}
                  button
                >
                  <ListItemText primary={list.name} />
                </ListItem>
              ))}
            </List>
          )
        }}
      </Query>
    )
  }
}

export default Lists
