const { ipcMain } = require('electron')

const lookup = require('../lang/lookup')

ipcMain.on('lookup', (event, links) => {
  event.sender.send('lookup-words', links)
  console.log(lookup)
})
