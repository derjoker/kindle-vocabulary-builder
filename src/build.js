const XLSX = require('xlsx')

const search = require('./duden')

const file = 'duden.xlsx'
const wb = XLSX.readFile(file)

const sheet = wb.Sheets['Kindle Mate']
const words = XLSX.utils.sheet_to_json(sheet).map(json => json['Stem'])
// console.log(words)
words.forEach(search)
