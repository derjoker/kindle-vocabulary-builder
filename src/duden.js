const Crawler = require('crawler')
const flatten = require('lodash/flatten')
const stringify = require('csv-stringify')
const fs = require('fs')

const file = 'duden.csv'
fs.writeFileSync(file, '')

const baseUrl = 'https://www.duden.de/suchen/dudenonline/'

function search (words = []) {
  const c = new Crawler({
    callback: function s (error, response, done) {
      if (error) {
        console.log(error)
      } else {
        const $ = response.$
        const links = $('#content section.wide > h2 > a')
          .toArray()
          .map(link => link.attribs.href)
        parse(links)
      }
      done()
    }
  })

  c.queue(words.map(word => baseUrl + word))
}

function parse (links = []) {
  const c = new Crawler({
    maxConnections: 20,
    callback: function p (error, response, done) {
      if (error) {
        console.log(error)
      } else {
        const $ = response.$
        const link = response.request.uri.href
        const word = $('section#block-system-main > h1')
          .text()
          .replace(/\u00AD/g, '')
        // console.log(word)

        const disabled = $('div > strong > span.disabled')
        const frequency = disabled && 5 - disabled.text().split('').length

        // console.log(frequency)
        if (frequency < 3) return

        const pairs = $('section.term-section').toArray().map(section => {
          const parent = $(section.parentNode).clone()
          parent.children('figure').remove()
          parent.children('section').remove()
          let definition = parent.html()

          const child = section.firstChild.next
          const clone = $(section).clone()
          clone.children('h3').remove()

          let examples = []

          // no definition
          if (parent.text().trim() === '') {
            definition = clone.children('span.iw_rumpf_info').first().html()
            // console.log(definition)
            examples = clone
              .children('span.iwtext')
              .toArray()
              .map(span => $(span).html())
            // console.log(examples)
          } else {
            if (child) {
              switch (child.name) {
                case 'div':
                case 'p':
                  examples = []
                  break
                case 'ul':
                  examples = $(child)
                    .children()
                    .toArray()
                    .map(li => $(li).html())
                  break
                default:
                  examples = [clone.html()]
                  break
              }
            }
          }
          // console.log(definition)
          // console.log(examples)

          return examples.map(example => [
            `${word}<br><br>${example}`,
            `${definition}<br><a href="${link}" target="_blank">${word}</a>`
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
      }
      done()
    }
  })

  c.queue(links)
}

// search(['Debatte', 'machen'])
// parse([
//   'https://www.duden.de/rechtschreibung/Mund_Oeffnung_Lippen_Schlund',
//   'https://www.duden.de/rechtschreibung/Aa_Kot',
//   'https://www.duden.de/rechtschreibung/schlieszen',
//   'https://www.duden.de/rechtschreibung/eisern' // TODO: RECHTSCHREIBUNG
// ])

module.exports = {
  parse,
  search
}
