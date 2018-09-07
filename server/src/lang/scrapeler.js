import Crawler from 'crawler'

export default function Scrapeler (parse) {
  const words = []
  const scrapeler = new Crawler({
    callback: function (error, response, done) {
      if (error) {
        // console.log(error)
      } else if (response.statusCode !== 200) {
        // console.log(response)
      } else {
        const link = response.request.uri.href
        const word = parse(response.$)
        word.link = link
        words.push(word)
      }
      done()
    }
  })

  scrapeler.result = words

  return scrapeler
}
