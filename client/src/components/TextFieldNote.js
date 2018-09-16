import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import { isNull } from 'lodash'

class TextFieldNote extends Component {
  constructor (props) {
    super(props)
    const value = this.props.data.note || ''
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
          const note = value === '' ? null : value

          if (note === data.note || (isNull(note) && isNull(data.note))) return

          save({
            id: data.id,
            note
          })
        }}
      />
    )
  }
}

TextFieldNote.propTypes = {
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired
}

export default TextFieldNote
