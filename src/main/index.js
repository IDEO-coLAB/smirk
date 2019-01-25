'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import fs from 'graceful-fs'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const GRIN_PATH = `${app.getPath('home')}/.grin/floo`
const DOWNLOAD_PATH = app.getPath('downloads')

// This needs to be set otherwise no API access is granted
// TODO: Ensure that if this is missing, the client handles gracefully
const secretBuf = fs.readFileSync(`${GRIN_PATH}/.api_secret`)
const grinApiSecretStr = secretBuf.toString()
const grinAuthSecretBuf = Buffer.from(`grin:${grinApiSecretStr}`)
const GRIN_AUTH_SECRET_B64 = grinAuthSecretBuf.toString('base64')

// set grin config as global
global.GRIN_CONFIG = {
  path: {
    download: DOWNLOAD_PATH,
    grin: GRIN_PATH
  },
  apiSecret: `Basic ${GRIN_AUTH_SECRET_B64}`
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
    title: 'Grin Wallet ツ',
    x: 50,
    y: 50,
    height: 120,
    width: 460,
    useContentSize: true,
    show: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false
    // resizable: false
  })

  var mainMenu = Menu.buildFromTemplate([
    {
      label: 'Grin Wallet ツ',
      submenu: [
        {
          label: 'Config',
          // TODO: Abstract out main + render constants
          // TODO: Also pull file paths for render and main into util
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV_TRIGGERED', { path: '/config' })
        },
        {
          label: 'Outputs',
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV_TRIGGERED', { path: '/outputs' })
        },
        {
          label: 'Transactions',
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV_TRIGGERED', { path: '/transactions' })
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click: () => app.quit()
        }
      ]
    }
  ])
  Menu.setApplicationMenu(mainMenu)

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

// TODO: Pull events constants into own file to de-dupe
ipcMain.on('RESIZE_WINDOW', (event, data) => {
  mainWindow.setSize(data.width, data.height, true)
})

ipcMain.on('DOWNLOAD_FILE', (event, args) => {
  fs.writeFile(`${DOWNLOAD_PATH}/${args.filename}`, args.filedata, (error) => {
    if (error) {
      event.sender.send('FILE_DOWNLOAD_ERROR')
      return
    }
    event.sender.send('FILE_DOWNLOAD_SUCCESS')
  })
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
