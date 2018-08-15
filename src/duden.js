const request = require('request')

const searchUrlBase = 'https://www.duden.de/suchen/dudenonline/'

function search (word) {
  const url = searchUrlBase + word
  request(url, (error, response, body) => {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    console.log(body)
  })
}

search('Debatte')
