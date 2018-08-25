const search = require('./duden')

describe('duden', () => {
  it('runs', () => {
    search(['Debatte', 'machen'])
  })
})
