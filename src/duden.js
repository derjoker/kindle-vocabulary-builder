const request = require('request')
const cheerio = require('cheerio')
const flatten = require('lodash/flatten')
const stringify = require('csv-stringify')
const fs = require('fs')

const file = 'duden.csv'
const searchUrlBase = 'https://www.duden.de/suchen/dudenonline/'

fs.writeFileSync(file, '')

function search (word) {
  const url = searchUrlBase + word
  request(url, (error, response, body) => {
    if (error || !response || !response.statusCode) {
      console.log(word)
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode)
      return
    }
    const $ = cheerio.load(body)
    const links = $('#content section.wide > h2 > a')
      .toArray()
      .map(link => link.attribs.href)
    links.forEach(load)
  })
}

function load (link) {
  request(link, (error, response, body) => {
    if (error || !response || !response.statusCode) {
      console.log(link)
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode)
      return
    }

    const $ = cheerio.load(body)
    const word = $('section#block-system-main > h1').text()

    const disabled = $('div > strong > span.disabled')
    const frequency = disabled && 5 - disabled.text().split('').length

    // console.log(frequency)
    if (frequency < 3) return

    const pairs = $('section.term-section').toArray().map(section => {
      const parent = $(section.parentNode).clone()
      parent.children('figure').remove()
      parent.children('section').remove()
      // if (parent.text().trim() === '')
      const definition = parent.html()

      const child = section.firstChild.next
      const clone = $(section).clone()
      clone.children('h3').remove()

      let examples
      switch (child.name) {
        case 'div':
          examples = []
          break
        case 'ul':
          examples = $(child).children().toArray().map(li => $(li).html())
          break
        default:
          examples = [clone.html()]
          break
      }
      // console.log(examples)

      return examples.map(example => [
        example,
        definition,
        `${word}<br>${example}`,
        `<a href="${link}" target="_blank">${word}</a><br>${definition}`
      ])
    })

    const cards = flatten(pairs)
    // console.log(cards)

    stringify(cards, (error, csv) => {
      if (error) console.log('error:', error)
      // console.log(csv)
      fs.writeFile(file, csv, { flag: 'a+' }, error => {
        if (error) console.log('error:', error)
      })
    })
  })
}

// search('Debatte')
// load('https://www.duden.de/rechtschreibung/Mund_Oeffnung_Lippen_Schlund')
// load('https://www.duden.de/rechtschreibung/Aa_Kot')
load('https://www.duden.de/rechtschreibung/schlieszen')
module.exports = search
