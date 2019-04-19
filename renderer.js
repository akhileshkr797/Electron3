const { ipcRenderer, remote } = require('electron')

//Sync IPC
const syncMsgBtn = document.getElementById('btn1')
syncMsgBtn.addEventListener('click', function() {
        const Reply = ipcRenderer.sendSync('sync-msg', 'Hello Rohit')
        console.log(Reply)
        const msg = `Akhilesh : ${Reply}`
        document.getElementById('msg1').innerHTML = msg
    })
    //Async IPC
const asyncMsgBtn = document.getElementById('btn2')
asyncMsgBtn.addEventListener('click', function(event, arg) {
    ipcRenderer.send('async-msg', 'Hello')
})

ipcRenderer.on('async-reply', function(event, arg) {
    const msg = `${arg}`
    document.getElementById('msg2').innerHTML = msg
})

//capture Page as PNG
document.getElementById('captureButton').addEventListener('click', captureButtonClickHandler)

function captureButtonClickHandler() {
    ipcRenderer.send('capture-window')
}

//print-to-pdf
document.getElementById('printButton').addEventListener('click', printButtonClickHandler)

function printButtonClickHandler() {
    ipcRenderer.send('print-to-pdf')
}

//context menu
window.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    ipcRenderer.send('show-context-menu')
})

//splashWindow
setTimeout(() => {
    ipcRenderer.send('get-mainWindow')
}, 5000)