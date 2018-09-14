import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
})

class WordTable extends Component {
  render () {
    const { classes, data } = this.props
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell>Example</TableCell>
              <TableCell>Definition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(word => {
              return (
                <TableRow className={classes.row} key={word.id}>
                  <TableCell component='th' scope='row'>
                    {word.word}
                  </TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: word.example }}
                  />
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: word.definition }}
                  />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

WordTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
}

export default withStyles(styles)(WordTable)
