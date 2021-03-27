const {app, BrowserWindow, screen, ipcMain, Menu, Tray} = require('electron');
const path = require('path');

/*******************************************初始化主窗口************************************************/
let mainWindow = null;
let closeWindow = null;
let dir = -1;//控制关闭窗口的状态
let tray = null;
let defaultOptions = {
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

let closeOptions = {
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    },
    x: -8,
    y: -8,
    width: 168,
    height: 168,
    frame: false,
    resizable: false,
    transparent: true,
    hasShadow: false,
    maximizable: false,
    minimizable: false,
};

app.on('ready', function () {
    Menu.setApplicationMenu(null);//去掉菜单

    mainWindow = new BrowserWindow(defaultOptions);
    mainWindow.setAlwaysOnTop(true);//始终置顶
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

    let screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    let screenHeight = screen.getPrimaryDisplay().workAreaSize.height;
    this.mainwin = mainWindow;//app自定义变量maiwin，方便remote调用
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    closeWindow = new BrowserWindow(closeOptions);
    closeWindow.setAlwaysOnTop(true);
    closeWindow.setSkipTaskbar(true);
    closeWindow.loadURL(path.join('file:', __dirname, './view/close/close.html'));
    this.closeWindow = closeWindow;
    this.dir = dir;
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

/*******************************************自定义方法************************************************/
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
            app.dir = 1;
            closeWindow.show();
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
                if ((x <= 100 && y <= 100) && app.dir != 2) {
                    app.dir = 2;
                    closeWindow.show();
                } else if ((x > 100 || y > 100) && app.dir != 1) {
                    app.dir = 1;
                    closeWindow.show();
                }
                win.setPosition(x, y, true);
            }, 10);
        } else {
            app.dir = -1;
            closeWindow.show();
            clearInterval(movingInterval);
            movingInterval = null;
        }
    });
};

/**
 * 清除移动监听，避免去掉移动事件失败
 */
app.clearMove = function clearMove() {
    ipcMain.removeAllListeners("window-move-open");
};

/**
 * 打印
 * @param message
 */
app.consoleString = function (message) {
    console.log(message.toString());
};
app.consoleObject = function (message) {
    console.log(JSON.stringify(message));
};

/**
 * 渲染进程切换页面
 */
ipcMain.on('switch-page', (event, id, urlPath) => {
    console.log(id + " " + urlPath);
    BrowserWindow.fromId(id).loadURL(path.join('file:', __dirname, urlPath));
});