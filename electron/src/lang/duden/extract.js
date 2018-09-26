const { flatten } = require('lodash')

module.exports = function extract ($) {
  const word = $('section#block-system-main > h1').text().replace(/\u00AD/g, '')
  // console.log(word)

  // const disabled = $('div > strong > span.disabled')
  // const frequency = disabled && 5 - disabled.text().split('').length
  // console.log(frequency)
  // if (frequency < 3) return

  const pairs = $('section.term-section').toArray().map(section => {
    const parent = $(section.parentNode).clone()
    parent.children('figure').remove()
    parent.children('section').remove()
    let definition = parent.html()

    const child = section.firstChild.next
    const clone = $(section).clone()
    clone.children('h3').remove()

    let examples = []

    // no definition
    if (parent.text().trim() === '') {
      definition = clone.children('span.iw_rumpf_info').first().html()
      // console.log(definition)
      examples = clone
        .children('span.iwtext')
        .toArray()
        .map(span => $(span).html())
      // console.log(examples)
    } else {
      if (child) {
        switch (child.name) {
          case 'div':
          case 'p':
            examples = []
            break
          case 'ul':
            examples = $(child).children().toArray().map(li => $(li).html())
            break
          default:
            examples = [clone.html()]
            break
        }
      }
    }
    // console.log(definition)
    // console.log(examples)

    return examples.map(example => ({
      example,
      definition,
      text: $.load(example).text()
    }))
  })

  return {
    word,
    pairs: flatten(pairs)
  }
}
