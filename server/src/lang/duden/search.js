export default function search ($) {
  const word = $('#edit-q').val()
  return $('#content section.wide > h2 > a')
    .toArray()
    .filter(link => $(link).text() === word)
    .map(link => link.attribs.href)
}
