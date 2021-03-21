const {remote} = require('electron');
const path = require('path');
var defaultOptions = {
    initWindow: {
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            // webSecurity: false
        },
        width: 200,
        height: 200,
        // parent: remote.app.mainwin,//默认主窗口，解决主窗口关闭后子窗口出错的问题
        frame: false,
        resizable: false,
        transparent: true,
    },
    style: {
        filePath: '#',
        alwaysOnTop: true,
        skipTaskbar: true,//不显示
        openDevTools: false
    }
};

const newWindow = function (options) {
    const BrowserWindow = remote.BrowserWindow;
    let tempOptions = $.extend(true, {}, defaultOptions);//使用一个临时的对象避免数据污染
    let lastOptions = $.extend(true, tempOptions, options);
    let var1 = new BrowserWindow(lastOptions.initWindow);
    var1.loadURL(path.join('file:', __dirname, lastOptions.style.filePath));
    var1.setSkipTaskbar(lastOptions.style.skipTaskbar);
    var1.setAlwaysOnTop(lastOptions.style.alwaysOnTop);
    if (lastOptions.style.openDevTools) {
        var1.webContents.openDevTools();
    }
    var1.on('closed', () => {
        var1 = null;
    });
    return var1;
};
export default newWindow;
