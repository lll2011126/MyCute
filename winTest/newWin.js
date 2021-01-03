window.nodeRequire = require;
const {ipcRenderer} = window["require"]("electron");

const {remote} = require('electron');

let newin;

function openWin() {
    // newin = window.open('winTest/popup_page.html', "popup");
    // console.log(newin);
    // console.log(remote.getCurrentWindow());

    // let win = remote.getCurrentWindow();
    // console.log("宽度:"+win.getSize()[0]);//获取窗口宽度
    // console.log("高度:" + win.getSize()[1]);//获取窗口高度
    // console.log("X: "+win.getPosition()[0]);//获取窗口横坐标
    // console.log("Y: " + win.getPosition()[1]);//获取窗口纵坐标

    // remote.app.windowMove(win);
    // ipcRenderer.send("window-move-open", true);

    /***********/
    const BrowserWindow = remote.BrowserWindow;
    newin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,//require未定义的问题
            enableRemoteModule: true//remote模块
        }
    });
    newin.on('closed', () => {
        newin = null;
    });

    newin.webContents.openDevTools();
    newin.loadFile('winTest/popup_page.html');

    setTimeout(function () {
        remote.BrowserWindow.fromId(newin.id).webContents.send('ping', remote.getCurrentWindow().id);
        console.log("A窗口发送ping：" + remote.getCurrentWindow().id);
    }, 300);
}

ipcRenderer.on('ping2', function (event, args) {
    console.log("A窗口接收到ping2：" + args);
    // remote.app.windowMove(args);
    // ipcRenderer.send("window-move-open", true);
})


function closeWin() {
    if (newin == null)
        return;
    newin.close();
    newin = null;
    // windowControl.windowMove(false);
    ipcRenderer.send("window-move-open", false);
}

window.addEventListener('message', (x) => {
    console.log(x.data);
});