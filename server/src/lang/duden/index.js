import Crawler from 'crawler'

import search from './search'
import parse from './parse'

const baseUrl = 'https://www.duden.de/suchen/dudenonline/'

const parser = new Crawler({
  callback: function p (error, response, done) {
    if (error) {
      console.log(error)
    } else if (response.statusCode !== 200) {
      console.log(response)
    } else {
      const $ = response.$
      const link = response.request.uri.href
      const word = parse($)
      word.link = link
      console.log(word)
    }
    done()
  }
})

parser.on('drain', () => {})

const searcher = new Crawler({
  callback: function s (error, response, done) {
    if (error) {
      console.log(error)
    } else if (response.statusCode !== 200) {
      console.log(response)
    } else {
      const $ = response.$
      const links = search($)
      parser.queue(links)
    }
    done()
  }
})

searcher.on('drain', () => {})

export default function duden (stems = []) {
  searcher.queue(stems.map(stem => baseUrl + stem))
}
