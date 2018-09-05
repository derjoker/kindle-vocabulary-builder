import Crawler from 'crawler'

const baseUrl = 'https://www.duden.de/suchen/dudenonline/'

describe('crawler', () => {
  it(
    'number of connections',
    done => {
      const counter = {
        error: 0,
        request: 0
      }
      const crawler = new Crawler({
        maxConnections: 2,
        callback: function (error, response, done) {
          if (error) {
            console.log(error)
            counter.error = counter.error + 1
          } else {
            expect(response.statusCode).toBe(200)
          }

          counter.request = counter.request + 1
          done()
        }
      })

      crawler.on('drain', () => {
        expect(counter.request).toBe(6 + counter.error)
        done()
      })

      crawler.queue(
        ['Debatte', 'machen', 'Mund', 'anfangen', 'Bus', 'nehmen'].map(
          stem => baseUrl + stem
        )
      )
      expect(crawler.queueSize).toBe(6)
    },
    50000
  )

  it(
    'queue',
    done => {
      const counter = {
        error: 0,
        request: 0
      }
      const crawler = new Crawler({
        callback: function (error, response, done) {
          if (error) {
            console.log(error)
            counter.error = counter.error + 1
          } else {
            expect(response.statusCode).toBe(200)
          }

          counter.request = counter.request + 1
          done()
        }
      })

      crawler.on('drain', () => {
        expect(counter.request).toBe(6 + counter.error)
        done()
      })

      crawler.queue(['Debatte', 'machen'].map(stem => baseUrl + stem))
      expect(crawler.queueSize).toBe(2)
      crawler.queue(['Mund', 'anfangen'].map(stem => baseUrl + stem))
      expect(crawler.queueSize).toBe(4)
      crawler.queue(['Bus', 'nehmen'].map(stem => baseUrl + stem))
      expect(crawler.queueSize).toBe(6)
    },
    50000
  )
})
