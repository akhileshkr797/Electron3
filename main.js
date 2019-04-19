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