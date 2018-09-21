import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import TextFieldStem from './TextFieldStem'

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

class VocabTable extends Component {
  render () {
    const { classes, data, save } = this.props
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Usage</TableCell>
              <TableCell>Word</TableCell>
              <TableCell>Stem</TableCell>
              <TableCell>Lang</TableCell>
              <TableCell>Title</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(vocab => {
              return (
                <TableRow className={classes.row} key={vocab.id}>
                  <TableCell component='th' scope='row'>
                    {vocab.usage}
                  </TableCell>
                  <TableCell>{vocab.word}</TableCell>
                  <TableCell>
                    <TextFieldStem data={vocab} save={save} />
                  </TableCell>
                  <TableCell>{vocab.lang}</TableCell>
                  <TableCell>{vocab.title}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        save({
                          id: vocab.id,
                          delete: true
                        })}
                      aria-label='Delete'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

VocabTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired
}

export default withStyles(styles)(VocabTable)
