module.exports = function lookup ($) {
  const word = $('#edit-q').val()
  return $('#content section.wide > h2 > a')
    .toArray()
    .filter(link => {
      const text = $(link).text()
      return (
        text === word ||
        text.startsWith(word + ',') ||
        text.endsWith('veraltet ' + word)
      )
    })
    .map(link => link.attribs.href)
}
