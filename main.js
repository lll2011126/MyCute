const {app, BrowserWindow, screen, ipcMain, Menu, Tray} = require('electron');

//nodejs中的path模块
const path = require('path');
// console.log(require.resolve('electron'))
// console.log(require('electron'))

var mainWindow = null;
let tray = null;
var defaultOptions = {
    webPreferences: {
        nodeIntegration: true,//require未定义的问题
        enableRemoteModule: true//remote模块
    },
    x: 0,
    y: 0,
    width: 500,
    height: 400,
    frame: false,
    resizable: false,
    transparent: true,
};

app.on('ready', function () {
    Menu.setApplicationMenu(null);//去掉菜单
    let screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    let screenHeight = screen.getPrimaryDisplay().workAreaSize.height;

    mainWindow = new BrowserWindow(defaultOptions);

    mainWindow.setAlwaysOnTop(true);
    mainWindow.setSkipTaskbar(true);//true为不显示任务栏
    // mainWindow.webContents.openDevTools();//开启调试界面，开启后透明失效
    mainWindow.loadURL(path.join('file:', __dirname, './view/index/index.html'));

    mainWindow.on('closed', () => {
        //关闭所有窗口
        let allWindow = BrowserWindow.getAllWindows();
        allWindow.forEach(function (item, idnex, array) {
            item.close();
        });
        mainWindow = null;
    });

    initTray();//添加托盘
    this.mainwin = mainWindow;//app自定义变量maiwin，方便remote调用
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
});

function initTray() {
    tray = new Tray(path.join(__dirname, './static/image/mycute.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '关闭', click: () => {
                mainWindow.destroy()
            }
        }
    ]);
    tray.setToolTip('mycute 2020-12');
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });
}

/**
 * 移动窗口的函数
 * @param win 必须是remote获取的对象
 */
app.windowMove = function windowMove(win) {
    if (win == null)
        return;
    let winStartPosition = {x: 0, y: 0};
    let mouseStartPosition = {x: 0, y: 0};
    let movingInterval = null;

    ipcMain.on("window-move-open", (events, canMoving) => {
        if (canMoving) {
            // 读取原位置
            winStartPosition = {x: win.getPosition()[0], y: win.getPosition()[1]};
            mouseStartPosition = screen.getCursorScreenPoint();
            // 清除
            if (movingInterval) {
                clearInterval(movingInterval);
            }
            // 新开
            movingInterval = setInterval(() => {
                // 实时更新位置
                const cursorPosition = screen.getCursorScreenPoint();
                const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
                const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
                win.setPosition(x, y, true);
            }, 10);
        } else {
            clearInterval(movingInterval);
            movingInterval = null;
        }
    });
};

app.clearMove = function clearMove() {
    ipcMain.removeAllListeners("window-move-open");
};

app.console = function (message) {
    console.log(message.toString());
};