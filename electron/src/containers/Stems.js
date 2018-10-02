import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  }
})

class Stems extends Component {
  constructor (props) {
    super(props)
    this.client = Stitch.defaultAppClient
    this.state = {
      stems: []
    }
  }

  componentWillMount () {
    const { id } = this.props.match.params
    this.client.callFunction('list', [id]).then(list => {
      console.log(list)
      if (list.stems) {
        this.setState({
          stems: list.stems
        })
      }
    })
  }

  render () {
    const { classes } = this.props
    const { stems } = this.state
    return (
      <div className={classes.root}>
        {stems.map((stem, index) => (
          <Chip
            key={index}
            avatar={<Avatar>{stem.stem[0]}</Avatar>}
            label={stem.stem}
            onClick={event => {
              console.log(event)
            }}
            onDelete={event => {
              console.log(event)
            }}
            className={classes.chip}
          />
        ))}
      </div>
    )
  }
}

Stems.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Stems)
