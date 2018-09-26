// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const usbDetect = require('usb-detection')
const path = require('path')
const glob = require('glob')

const isDev = require('electron-is-dev')

let kindles = 0
const KINDLE_VENDORID = 6473
const KINDLE_PRODUCTID = 4

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '/preload.js')
    }
  })

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  usbDetect.startMonitoring()

  usbDetect.find(KINDLE_VENDORID, KINDLE_PRODUCTID, (error, devices) => {
    if (!error) {
      kindles = devices.length
      mainWindow.webContents.send('kindles', kindles)
    }
  })

  usbDetect.on(`add:${KINDLE_VENDORID}:${KINDLE_PRODUCTID}`, device => {
    kindles += 1
    mainWindow.webContents.send('kindles', kindles)
  })

  usbDetect.on(`remove:${KINDLE_VENDORID}:${KINDLE_PRODUCTID}`, device => {
    kindles -= 1
    mainWindow.webContents.send('kindles', kindles)
  })

  ipcMain.on('kindles', event => {
    event.returnValue = kindles
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const files = glob.sync(path.join(__dirname, '../src/main/**/*.js'))
files.forEach(file => {
  require(file)
})
