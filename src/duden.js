const request = require('request')
const cheerio = require('cheerio')
const compact = require('lodash/compact')
const flatten = require('lodash/flatten')

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
    console.log(links)
  })
}

function load (link) {
  request(link, (error, response, body) => {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    const $ = cheerio.load(body)
    const word = $('section#block-system-main > h1').text()
    const cards = flatten(
      $('section.term-section').toArray().map(section => {
        const definition = section.parentNode.firstChild.data.trim()
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
    console.log(cards)
  })
}

search('Debatte')
load('https://www.duden.de/rechtschreibung/Debatte')
