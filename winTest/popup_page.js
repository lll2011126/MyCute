import windowControl from "../common/custom/windowControl.js";
window.nodeRequire = require;

window.$ = window.jQuery = require('../common/jquery-3.5.1.min.js');


const {ipcRenderer} = window["require"]("electron");

const {remote} = require('electron');

let win ;

$(document).ready(function(){

});


remote.app.windowMove(remote.getCurrentWindow());
// ipcRenderer.send("window-move-open", true);
// windowControl(true);

// ipcRenderer.on('ping', function (event, args) {
//     console.log("B窗口接收到ping：" + args);
//     remote.BrowserWindow.fromId(args).webContents.send('ping2', remote.getCurrentWindow());
//     console.log("B窗口发送ping2：" + win);
//
// })

var btnPopChiildWin=document.getElementById('hello');
btnPopChiildWin.onclick = send;
function send() {
    win = remote.getCurrentWindow();
    console.log("hello");
}

