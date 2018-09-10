import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import { isNull } from 'lodash'

class TextFieldStem extends Component {
  constructor (props) {
    super(props)
    const value = this.props.data.stem || undefined
    this.state = {
      value
    }
  }

  render () {
    const { data, save } = this.props
    return (
      <TextField
        value={this.state.value}
        onChange={event =>
          this.setState({
            value: event.target.value
          })}
        onKeyUp={event => {
          // console.log(event.key)
          if (event.key === 'Enter') {
            event.target.blur()
          }
        }}
        onBlur={event => {
          // const value = event.target.value.trim()
          const value = event.target.value
          const stem = value === '' ? null : value

          if (stem === data.stem || (isNull(stem) && isNull(data.stem))) return

          save({
            id: data.id,
            stem
          })
        }}
      />
    )
  }
}

TextFieldStem.propTypes = {
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired
}

export default TextFieldStem
