const Crawler = require('crawler')

const duden = require('./duden')

module.exports = function extract (words, done) {
  const queues = words
    .map(word => {
      let uri
      let parse = () => {}
      switch (word.lang) {
        case 'de':
          uri = word.link
          parse = duden.extract
          break
      }

      function callback (error, response, done) {
        if (error) {
          // console.log(error)
        } else if (response.statusCode !== 200) {
          // console.log(response)
        } else {
          const _word = parse(response.$)
          console.log(_word)
          word.word = _word.word
          word.pairs = _word.pairs
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
