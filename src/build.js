const XLSX = require('xlsx')

const file = 'kindle-vocabulary-builder.xlsx'
const wb = XLSX.readFile(file)

// console.log(wb.SheetNames)
wb.SheetNames.forEach(name => {
  const sheet = wb.Sheets[name]
  const words = XLSX.utils.sheet_to_json(sheet).map(json => json['Word'])

  switch (name) {
    case 'Deutsch':
      console.log(words)
      break
  }
})
