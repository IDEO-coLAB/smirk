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

const PATHS = {
  DOWNLOAD: app.getPath('downloads'),
  GRIN: `${app.getPath('home')}/.grin/floo`
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
      label: 'Smirk',
      submenu: [
        {
          label: 'Settings',
          // TODO: Abstract out main + render constants
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV', { path: '/settings' })
        },
        {
          label: 'Outputs',
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV', { path: '/outputs' })
        },
        {
          label: 'Transactions',
          click: () => mainWindow.webContents.send('MAIN_MENU_NAV', { path: '/transactions' })
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
    mainWindow.webContents.send('LOAD_SETTINGS', {
      paths: {
        download: PATHS.DOWNLOAD,
        grin: PATHS.GRIN
      }
    })
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

// TODO: Pull events into own file?
// TODO: Pull constants into file for main and render
// resize window event passed in from client
ipcMain.on('RESIZE_WINDOW', (event, data) => {
  mainWindow.setSize(data.width, data.height, true)
})

ipcMain.on('DOWNLOAD_FILE', (event, args) => {
  fs.writeFile(`${PATHS.DOWNLOAD}/${args.filename}`, args.filedata, (error) => {
    if (error) {
      event.sender.send('DOWNLOAD_FILE_ERROR')
      return
    }
    event.sender.send('DOWNLOAD_FILE_SUCCESS')
  })
})

// const buffer = fs.readFileSync(PATHS.GRIN + '/.api_secret')
// console.log('the secret is....')
// console.log('Basic ' + buffer.toString('base64'))

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
