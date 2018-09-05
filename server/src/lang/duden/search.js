export default function search ($) {
  return $('#content section.wide > h2 > a')
    .toArray()
    .map(link => link.attribs.href)
}
