import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Divider
} from '@material-ui/core'

import TextFieldNote from './TextFieldNote'

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}

class WordCard extends Component {
  constructor (props) {
    super(props)
    this.saveCategory = this.saveCategory.bind(this)
  }

  componentWillMount () {
    document.body.addEventListener('keydown', event => {
      // console.log(event)
      if (event.target.nodeName === 'INPUT') return

      switch (event.key) {
        case 'a':
          this.saveCategory('EASY')
          break
        case 's':
          this.saveCategory('LEARN')
          break
        case 'd':
          this.saveCategory('HARD')
          break
        case 'f':
          this.saveCategory('DELETE')
          break
        default:
          break
      }
    })
  }

  saveCategory (value) {
    const { card, save } = this.props
    save({
      id: card.id,
      category: value
    })
    this.props.next()
  }

  render () {
    const { classes, card, save } = this.props

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='headline' component='h3' color='textSecondary'>
            {card.category
              ? `${card.word.word} (${card.category})`
              : card.word.word}
          </Typography>
          <br />
          <Typography
            variant='headline'
            component='h2'
            dangerouslySetInnerHTML={{ __html: card.word.example }}
          />
          <br />
          <Divider />
          <br />
          <Typography
            component='p'
            dangerouslySetInnerHTML={{ __html: card.word.definition }}
          />
          <br />
          <TextFieldNote key={card.id} data={card} save={save} />
        </CardContent>
        <CardActions>
          {['EASY', 'LEARN', 'HARD', 'DELETE'].map((value, index) => (
            <Button
              key={index}
              size='small'
              onClick={() => {
                this.saveCategory(value)
              }}
            >
              {value}
            </Button>
          ))}
        </CardActions>
      </Card>
    )
  }
}

WordCard.propTypes = {
  classes: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
}

export default withStyles(styles)(WordCard)
