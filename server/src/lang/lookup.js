import Crawler from 'crawler'

import duden from './duden/parse'

export default function lookup (links, done) {
  const result = []

  const crawler = new Crawler({
    callback: function (error, response, done) {
      if (error) {
        // console.log(error)
      } else if (response.statusCode !== 200) {
        // console.log(response)
      } else {
        const link = response.request.uri.href
        let parse = function () {}

        if (link.startsWith('https://www.duden.de/rechtschreibung/')) {
          parse = duden
        }

        const word = parse(response.$)
        if (word) {
          word.link = link
          result.push(word)
        }
      }
      done()
    }
  })

  crawler.queue(links)

  crawler.on('drain', () => {
    done(result)
  })
}
