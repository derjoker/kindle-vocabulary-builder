const { ipcMain } = require('electron')
const { flatten } = require('lodash')

const lookup = require('../lang/lookup')
const extract = require('../lang/extract')

ipcMain.on('lookup', (event, links) => {
  lookup(links, () => {
    console.log('links', links)
    event.sender.send(
      'lookup-links',
      links.map(link => ({
        id: link.id,
        links: link.links
      }))
    )

    const words = flatten(
      links.map(link => {
        if (Array.isArray(link.links)) {
          return link.links.map(_link => ({
            lang: link.lang,
            stem: link.stem,
            link: _link
          }))
        } else {
          console.log('error', links)
          return []
        }
      })
    )

    extract(words, () => {
      console.log('words', words)
      event.sender.send(
        'lookup-words',
        flatten(
          words.map(word =>
            word.pairs.map(pair => {
              pair.link = word.link
              pair.lang = word.lang
              pair.stem = word.stem
              pair.word = word.word
              return pair
            })
          )
        )
      )
    })
  })
})
