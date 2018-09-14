import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Select,
  MenuItem,
  Paper
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { range } from 'lodash'

import TextFieldNote from './TextFieldNote'
import SelectCategory from './SelectCategory'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
})

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

class TablePaginationActions extends Component {
  render () {
    const { classes, count, page, rowsPerPage, onChangePage } = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={() => {
            onChangePage(0)
          }}
          disabled={page === 0}
          aria-label='First Page'
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            onChangePage(page - 1)
          }}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Select
          value={page}
          onChange={event => onChangePage(event.target.value)}
        >
          {range(Math.ceil(count / rowsPerPage)).map(value => (
            <MenuItem key={value} value={value}>{value + 1}</MenuItem>
          ))}
        </Select>
        <IconButton
          onClick={() => {
            onChangePage(page + 1)
          }}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={() => {
            onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))
          }}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          <LastPageIcon />
        </IconButton>
      </div>
    )
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
}

const TablePaginationActionsWrapped = withStyles(actionsStyles)(
  TablePaginationActions
)

class CardTable extends Component {
  render () {
    const {
      classes,
      data,
      count,
      page,
      rowsPerPage,
      onChangePage,
      save
    } = this.props
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
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={5}
                count={count}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                page={page}
                onChangePage={onChangePage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

CardTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
}

export default withStyles(styles)(CardTable)
