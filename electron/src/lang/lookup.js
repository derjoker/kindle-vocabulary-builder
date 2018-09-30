const duden = require('./duden')

const lookups = {
  duden
}

module.exports = function lookup (lang, dict, stems) {
  const words = stems.map(stem => ({
    lang,
    dict,
    stem
  }))

  const lookup = lookups[dict]

  return new Promise((resolve, reject) => {
    if (lookup) {
      lookup(words, () => {
        resolve(words)
      })
    } else {
      reject(new Error('Dict Not Supported Yet.'))
    }
  })
}
