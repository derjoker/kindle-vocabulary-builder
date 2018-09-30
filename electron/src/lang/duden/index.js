const Crawler = require('crawler')
const { URL } = require('url')
const flatten = require('lodash/flatten')

const lookup = require('./lookup')
const extract = require('./extract')

function lookupler (words, done) {
  const crawler = new Crawler()

  const lookups = words.map(word => {
    const uri = new URL('https://www.duden.de/suchen/dudenonline/' + word.stem)

    function callback (error, response, done) {
      if (error) {
        // console.log(error)
      } else if (response.statusCode !== 200) {
        // console.log(response)
      } else {
        const entries = lookup(response.$)
        // console.log(entries)
        word.entries = entries
      }
      done()
    }

    return { uri, callback }
  })

  crawler.queue(lookups)

  crawler.on('drain', () => {
    done()
  })
}

function extractler (words, done) {
  const entries = []

  const crawler = new Crawler()

  const extracts = flatten(words.map(word => word.entries)).map(entry => {
    const uri = entry.link

    function callback (error, response, done) {
      if (error) {
        // console.log(error)
      } else if (response.statusCode !== 200) {
        // console.log(response)
      } else {
        const entry = extract(response.$)
        // console.log(entry)
        entry.link = uri
        entries.push(entry)
      }
      done()
    }

    return { uri, callback }
  })

  crawler.queue(extracts)

  crawler.on('drain', () => {
    // console.log(entries)
    const byLink = new Map(entries.map(entry => [entry.link, entry]))
    words.forEach(word => {
      word.entries = word.entries.map(entry => byLink.get(entry.link))
    })
    done()
  })
}

module.exports = function duden (words, done) {
  lookupler(words, () => {
    extractler(words, () => {
      done()
    })
  })
}
