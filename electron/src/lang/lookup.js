const { URL } = require('url')
const Crawler = require('crawler')

const duden = require('./duden')

module.exports = function lookup (links, done) {
  const queues = links
    .map(link => {
      let uri
      let parse = () => {}
      switch (link.lang) {
        case 'de':
          uri = new URL('https://www.duden.de/suchen/dudenonline/' + link.stem)
          parse = duden.lookup
          break
      }

      function callback (error, response, done) {
        if (error) {
          // console.log(error)
        } else if (response.statusCode !== 200) {
          // console.log(response)
        } else {
          const _links = parse(response.$)
          console.log(_links)
          link.links = _links
        }
        done()
      }

      return { uri, callback }
    })
    .filter(queue => queue.uri)

  const crawler = new Crawler()

  crawler.queue(queues)

  crawler.on('drain', () => {
    done()
  })
}
