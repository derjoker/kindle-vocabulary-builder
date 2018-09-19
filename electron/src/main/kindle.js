const { ipcMain } = require('electron')
const Database = require('better-sqlite3')

ipcMain.on('kindle-load', event => {
  const vocab = '/Volumes/Kindle/system/vocabulary/vocab.db'
  const db = new Database(vocab, {
    fileMustExist: true
  })
  const vocabs = db
    .prepare(
      `
      SELECT LOOKUPS.id, LOOKUPS.usage, WORDS.word, WORDS.stem, WORDS.lang, BOOK_INFO.title FROM LOOKUPS
      JOIN WORDS
      ON LOOKUPS.word_key = WORDS.id
      JOIN BOOK_INFO
      ON LOOKUPS.book_key = BOOK_INFO.id
      `
    )
    .all()

  event.sender.send('kindle-loaded', vocabs)
})
