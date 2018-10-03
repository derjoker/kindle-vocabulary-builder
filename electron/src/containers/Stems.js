import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import uniq from 'lodash/uniq'
import difference from 'lodash/difference'
import flattenDepth from 'lodash/flattenDepth'
import stringify from 'csv-stringify'

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
      list: null,
      stems: []
    }
  }

  componentWillMount () {
    const { id } = this.props.match.params
    this.client.callFunction('list', [id]).then(list => {
      console.log(list)
      if (list.stems) {
        this.setState({
          list,
          stems: list.stems
        })
      }
      if (list.title) {
        const condition = {
          lang: list.lang,
          title: list.title
        }
        // console.log(list, condition)
        this.client.callFunction('vocabs', [condition]).then(vocabs => {
          console.log(vocabs)
          const stemsInVocabs = uniq(vocabs.map(vocab => vocab.stem))
          console.log(stemsInVocabs)
          const stemsInList = this.state.stems.map(stem => stem.stem)
          const stems = difference(stemsInVocabs, stemsInList).map(stem => ({
            stem
          }))
          console.log(stems)
          if (stems.length) {
            this.client.callFunction('addListStems', [id, stems])
            this.setState({
              stems: this.state.stems.concat(stems)
            })
          }
        })
      }
    })
  }

  render () {
    const { classes } = this.props
    const { list, stems } = this.state
    return (
      <div>
        <div>
          <Button
            disabled={!stems.length}
            onClick={() => {
              this.client
                .callFunction('words', [
                  list.lang,
                  list.dict,
                  stems
                    .filter(stem => stem.status !== 'delete')
                    .map(stem => stem.stem)
                ])
                .then(words => {
                  console.log(words)
                  const cards = flattenDepth(
                    words.map(word =>
                      word.entries.map(entry =>
                        entry.definitions.map(definition =>
                          definition.examples.map(example => [
                            `<h2>${entry.word}</h2><p>${example.example}</p>`,
                            definition.definition
                          ])
                        )
                      )
                    ),
                    3
                  )
                  console.log(cards)
                  stringify(cards, (error, output) => {
                    if (error) console.log(error)
                    else {
                      // console.log(output)
                      const filename = 'anki.csv'
                      const data = encodeURI(
                        'data:text/csv;charset=utf-8,' + output
                      )
                      const link = document.createElement('a')
                      link.setAttribute('href', data)
                      link.setAttribute('download', filename)
                      link.click()
                    }
                  })
                })
            }}
          >
            CSV
          </Button>
        </div>
        <div className={classes.root}>
          {stems.map((stem, index) => (
            <Chip
              key={index}
              label={stem.stem}
              onClick={event => {
                console.log(event)
              }}
              onDelete={() => {
                stem.status = stem.status === 'delete' ? 'learn' : 'delete'
                const { id } = this.props.match.params
                this.client.callFunction('updateListStem', [id, stem])
                stems[index] = stem
                this.forceUpdate()
              }}
              className={classes.chip}
              deleteIcon={
                stem.status === 'delete' ? <DoneIcon /> : <CancelIcon />
              }
              color={stem.status === 'delete' ? 'secondary' : 'primary'}
            />
          ))}
        </div>
      </div>
    )
  }
}

Stems.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Stems)
