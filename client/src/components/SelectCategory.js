import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, MenuItem } from '@material-ui/core'

class SelectCategory extends Component {
  constructor (props) {
    super(props)
    const value = this.props.data.category || ''
    this.state = {
      value
    }
  }

  render () {
    const { data, save } = this.props
    return (
      <Select
        value={this.state.value}
        onChange={event => {
          this.setState({
            value: event.target.value
          })
          save({
            id: data.id,
            category: event.target.value
          })
        }}
      >
        <MenuItem value={'EASY'}>EASY</MenuItem>
        <MenuItem value={'LEARN'}>LEARN</MenuItem>
        {/* <MenuItem value={'STAGED'}>STAGED</MenuItem> */}
        <MenuItem value={'HARD'}>HARD</MenuItem>
        <MenuItem value={'DELETE'}>DELETE</MenuItem>
      </Select>
    )
  }
}

SelectCategory.propTypes = {
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired
}

export default SelectCategory
