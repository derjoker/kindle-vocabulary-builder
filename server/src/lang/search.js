/* global URL */
import Crawler from 'crawler'

import duden from './duden/search'

export default function search (vocabs, done) {
  const result = []

  const queues = vocabs
    .map(vocab => {
      let uri
      let parse = function () {}
      switch (vocab.lang) {
        case 'de':
          uri = new URL('https://www.duden.de/suchen/dudenonline/' + vocab.stem)
          parse = duden
          break
      }

      function callback (error, response, done) {
        if (error) {
          // console.log(error)
        } else if (response.statusCode !== 200) {
          // console.log(response)
        } else {
          const links = parse(response.$)
          result.push({
            id: vocab.id,
            build: true,
            links
          })
        }
        done()
      }

      return { uri, callback }
    })
    .filter(queue => queue.uri)

  const crawler = new Crawler()

  crawler.queue(queues)

  crawler.on('drain', () => {
    done(result)
  })
}
