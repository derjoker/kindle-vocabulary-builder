const { ipcMain } = require('electron')

const lookup = require('../lang/lookup')

ipcMain.on('lookup', async (event, lang, dict, stems) => {
  const words = await lookup(lang, dict, stems)
  event.sender.send('lookup-words', words)
})
