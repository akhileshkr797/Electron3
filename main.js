const electron = require('electron')
const { app, BrowserWindow, webcontents, ipcMain, Menu, MenuItem } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

//Application Menu
let template = [{
    label: 'Application',
    submenu: [{
        label: 'About'
    }]

}, {
    label: 'Account',
    submenu: [{
        label: 'CCBDX'
    }, {
        label: 'CCERP'
    }, {
        type: 'separator'
    }, {
        label: 'OWL'
    }, {
        type: 'separator'
    }, {
        label: 'CCCOM'
    }, {
        label: 'TEST'
    }]

}, {
    label: 'Users',
    submenu: [{
        label: 'ESC'
    }, {
        label: 'HNV'
    }, {
        type: 'separator'
    }, {
        label: 'SNA'
    }, {
        type: 'separator'
    }, {
        label: 'SDJ'
    }, {
        label: 'ABHI'
    }]

}, {
    label: 'Windows',
    submenu: [{
        label: 'Help'
    }]
}]



let mainWindow, splashWindow, windowToCapture, windowToPrint

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 700,
        backgroundColor: '#cce'
    })

    //mainWindow.webContents.openDevTools()

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', function() {
        mainWindow = null
    })

    //webContents Events

    mainWindow.webContents.on('did-finish-load', event => {
        console.log('did-finish-load', BrowserWindow.fromId(event.sender.webContents.id).getTitle())
    })

    mainWindow.webContents.on('did-start-loading', event => {
        console.log('did-start-loading', event.sender.webContents.browserWindowOptions.title)
    })

    mainWindow.webContents.on('dom-ready', event => {
        console.log('dom-ready')
    })

    mainWindow.webContents.on('did-stop-loading', event => {
        console.log('did-stop-loading', event.sender.webContents.id)
    })
}

app.on('ready', function() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    createSplashWindow()
})

//splash Window
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 350,
        height: 300,
        frame: false,
        resizable: false,
        backgroundColor: '#000',
        alwaysOnTop: true,
        show: false
    })
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file',
        slashes: true
    }))
    splashWindow.on('closed', () => {
        splashWindow = null
    })
    splashWindow.once('ready-to-show', () => {
        splashWindow.show()
        createWindow()
    })
}

ipcMain.on('get-mainWindow', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 1000)
    }
    mainWindow.show()
})


// IPC-Main Messaging

//sync
ipcMain.on('sync-msg', function(event, arg) {
    event.returnValue = 'Hello Rohit..How are you?'
})

//Async
ipcMain.on('async-msg', function(event, arg) {
    if (arg === 'Hello') {
        event.sender.send('async-reply', 'Rohit: I am Fine Akhilesh')
    }
})

//Capture Window as PNG

ipcMain.on('capture-window', event => {
    windowToCapture = BrowserWindow.fromId(event.sender.webContents.id)
    let bounds = windowToCapture.getBounds()
    windowToCapture.webContents.capturePage({
        x: 0,
        y: 0,
        width: bounds.width,
        height: bounds.height
    }, imageCaptured)
})

function imageCaptured(image) {
    let desktop = app.getPath('desktop')
    let filePath = desktop + '/' + windowToCapture.getTitle() + '-captured.png'
    console.log(filePath)
    let png = image.toPNG()
    fs.writeFileSync(filePath, png)
}

//print-to-pdf
ipcMain.on('print-to-pdf', event => {
    windowToPrint = BrowserWindow.fromId(event.sender.webContents.id)
    windowToPrint.webContents.printToPDF({}, pdfCreated)
})

function pdfCreated(error, data) {
    let desktop = app.getPath('desktop')
    let filePath = desktop + '/' + windowToPrint.getTitle() + '-printed.pdf'
    console.log(filePath)
    if (error) {
        console.error(error.message)
    }
    if (data) {
        fs.writeFile(filePath, data, error => {
            if (error) {
                console.error(error.message)
            }
        })
    }
}

//context Menu

ipcMain.on('show-context-menu', function(event) {
    const win = BrowserWindow.fromWebContents(event.sender)
    contextMenu.popup(win)
})

const contextMenu = new Menu()
contextMenu.append(new MenuItem({
    label: 'cut',
    role: 'cut'
}))
contextMenu.append(new MenuItem({
    label: 'copy',
    role: 'copy'
}))
contextMenu.append(new MenuItem({
    label: 'paste',
    role: 'paste'
}))
contextMenu.append(new MenuItem({
    label: 'Select All',
    role: 'selectall'
}))
contextMenu.append(new MenuItem({
    type: 'separator'
}))

contextMenu.append(new MenuItem({
    label: 'custom',
    click() {
        console.log('Custom Menu')
    }
}))

contextMenu.append(new MenuItem({
    type: 'separator'
}))

contextMenu.append(new MenuItem({
    label: 'Zoom-In',
    role: 'zoomin'
}))

contextMenu.append(new MenuItem({
    label: 'Zoom-Out',
    role: 'zoomout'
}))