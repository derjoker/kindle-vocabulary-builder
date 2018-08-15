const request = require('request')
const cheerio = require('cheerio')
const compact = require('lodash/compact')
const flatten = require('lodash/flatten')
const stringify = require('csv-stringify')
const fs = require('fs')

const searchUrlBase = 'https://www.duden.de/suchen/dudenonline/'

function search (word) {
  const url = searchUrlBase + word
  request(url, (error, response, body) => {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    const $ = cheerio.load(body)
    const links = $('#content section.wide > h2 > a')
      .toArray()
      .map(link => link.attribs.href)
    links.forEach(load)
  })
}

function load (link) {
  request(link, (error, response, body) => {
    console.log(link)
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    const $ = cheerio.load(body)
    const word = $('section#block-system-main > h1').text()
    const cards = flatten(
      $('section.term-section').toArray().map(section => {
        const clone = $(section.parentNode).clone()
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
        ).map(example => [example, `${word}<br>${definition}`])
      })
    )
    stringify(cards, (error, csv) => {
      console.log('error:', error)
      console.log(csv)
      fs.writeFile('duden.csv', csv, { flag: 'a+' }, error => {
        console.log('error:', error)
      })
    })
  })
}

search('Debatte')
