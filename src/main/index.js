'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Variable to track if the user is closing the app or quitting it
let willQuitApp = false

const WINDOW_URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// Handles the initialization of the application window
const createWindow = async () => {
  // Initial window options
  mainWindow = new BrowserWindow({
    title: 'Smirk',
    x: 50,
    y: 50,
    height: 220,
    width: 950,
    useContentSize: true,
    show: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false
    // resizable: false
  })

  mainWindow.loadURL(WINDOW_URL)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // 'close' fires before 'closed' event, this handler checks
  // if the user wants to quit the app or just close the window
  mainWindow.on('close', (event) => {
    // the user is quitting the entire app
    // the user only tried to close the window, not quit the app
    if (!willQuitApp) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  const appNeedsWindow = mainWindow &&
    !mainWindow.isVisible() &&
    !mainWindow.isMinimized()

  // Note on OS X: This re-creates the app's window when the dock icon is
  // clicked and the window is not currently open
  if (appNeedsWindow) {
    createWindow()
  }
})

// 'before-quit' is emitted when Electron receives the signal to quit the app
// This is a different behavior than minimizing it or closing the app
// When the user want to actually quit the app, we use this variable
// to ensure that quit happens, not just a window close / minimization
app.on('before-quit', () => {
  willQuitApp = true
})

// resize window event passed in from client
ipcMain.on('resizeWindow', (event, data) => {
  mainWindow.setSize(data.width, data.height, true)
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
