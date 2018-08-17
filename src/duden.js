const request = require('request')
const cheerio = require('cheerio')
const compact = require('lodash/compact')
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

    const cards = flatten(
      $('section.term-section').toArray().map(section => {
        const clone = $(section.parentNode).clone()
        clone.children('figure').remove()
        clone.children('section').remove()
        const definition = clone.html()

        return compact(
          flatten(
            section.children.map(child => {
              switch (child.name) {
                case 'span':
                  return $(child).html()
                case 'ul':
                  return child.children.map(li => $(li).html())
                default:
              }
            })
          )
        ).map(example => [
          `${word}<br>${example}`,
          `<a href="${link}" target="_blank">${word}</a><br>${definition}`
        ])
      })
    )
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
module.exports = search
