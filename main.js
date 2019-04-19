const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const path = require('path')
const url = require('url')

let mainWindow, splashWindow

//mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 800,
        title: 'mainWindow'
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', function() {
        mainWindow = null
    })
}

//splash window
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        show: false,
        width: 350,
        height: 250,
        frame: false,
        alwaysOnTop: true,
    })

    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file:',
        slashes: true
    }))

    splashWindow.once('ready-to-show', () => {
        splashWindow.show()
        createWindow()
    })

    splashWindow.on('closed', function() {
        splashWindow = null
    })
}

ipcMain.on('app-init', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 2000)
    }
    mainWindow.show()
})

app.on('ready', () => {
    createSplashWindow()
})