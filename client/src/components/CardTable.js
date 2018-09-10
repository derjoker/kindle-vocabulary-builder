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

import TextFieldNote from './TextFieldNote'
import SelectCategory from './SelectCategory'

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

class CardTable extends Component {
  render () {
    const { classes, data, save } = this.props
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell>Front</TableCell>
              <TableCell>Back</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(card => {
              return (
                <TableRow className={classes.row} key={card.id}>
                  <TableCell component='th' scope='row'>
                    {card.word.word}
                  </TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: card.word.example }}
                  />
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: card.word.definition }}
                  />
                  <TableCell>
                    <TextFieldNote data={card} save={save} />
                  </TableCell>
                  <TableCell>
                    <SelectCategory data={card} save={save} />
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

CardTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
}

export default withStyles(styles)(CardTable)
