import Crawler from 'crawler'

export default function Searchler (parse) {
  const searches = []
  const searchler = new Crawler({
    callback: function (error, response, done) {
      if (error) {
        // console.log(error)
      } else if (response.statusCode !== 200) {
        // console.log(response)
      } else {
        const stem = response.request.uri.href.split('/').pop()
        const links = parse(response.$)
        searches.push({
          stem,
          links
        })
      }
      done()
    }
  })

  searchler.result = searches

  return searchler
}
