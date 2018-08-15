const request = require('request')
const cheerio = require('cheerio')

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

search('Debatte')
