const {app, BrowserWindow, screen, ipcMain, Menu, Tray} = require('electron');
const path = require('path');

/*******************************************初始化主窗口************************************************/
let mainWin = {
    mainWindow: null,
    defaultOptions: {
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
        transparent: true
    },
    indexPath: './view/index/index.html'
};

let closeWin = {
    closeWindow: null,
    closeWinStatus: -1,//控制关闭窗口的状态 1、显示  -1、缩小  2、扩大
    defaultOptions: {
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
    },
    indexPath: './view/close/close.html'
};

const _enum = {
    closeWinStatus: {
        show: 1,
        hide: -1,
        prompt: 2
    }
};

let tray = null;

app.on('ready', function () {
    this.enum = _enum;
    this.screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    this.screenHeight = screen.getPrimaryDisplay().workAreaSize.height;
    Menu.setApplicationMenu(null);//去掉菜单

    /*****初始化主窗口*****/
    mainWin.mainWindow = new BrowserWindow(mainWin.defaultOptions);
    mainWin.mainWindow.setAlwaysOnTop(true);//始终置顶
    mainWin.mainWindow.setSkipTaskbar(true);//true为不显示任务栏
    // mainWin.mainWindow.webContents.openDevTools();//开启调试界面，开启后透明失效
    mainWin.mainWindow.loadURL(path.join('file:', __dirname, mainWin.indexPath));
    mainWin.mainWindow.on('closed', () => {
        //关闭所有窗口
        BrowserWindow.getAllWindows().forEach(function (item, idnex, array) {
            item.close();
        });
        mainWin.mainWindow = null;
    });
    this.mainwin = mainWin.mainWindow;//app自定义变量maiwin，方便remote调用
    initTray();//添加托盘

    /*****初始化关闭窗口*****/
    closeWin.closeWindow = new BrowserWindow(closeWin.defaultOptions);
    closeWin.closeWindow.setAlwaysOnTop(true);
    closeWin.closeWindow.setSkipTaskbar(true);
    closeWin.closeWindow.loadURL(path.join('file:', __dirname, closeWin.indexPath));
    this.closeWindow = closeWin.closeWindow;
    this.closeWinStatus = closeWin.closeWinStatus;
    this.closeWindowWidth = closeWin.defaultOptions.width;
    this.closeWindowHeight = closeWin.defaultOptions.height;
});

function initTray() {
    tray = new Tray(path.join(__dirname, './static/image/mycute.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '关闭', click: () => {
                mainWin.mainWindow.destroy();
            }
        }
    ]);
    tray.setToolTip('mycute 2020-12');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        mainWin.mainWindow.isVisible() ? mainWin.mainWindow.hide() : mainWin.mainWindow.show();
    });
}

/*******************************************自定义方法************************************************/
///////////主进程自己使用//////////////
function closeWindowStatusChange(closeWinStatus) {
    app.closeWinStatus = closeWinStatus;
    closeWin.closeWindow.show();
}

//////////////////////////////////////
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
            // 移动
            movingInterval = setInterval(() => {
                // 实时更新位置
                const cursorPosition = screen.getCursorScreenPoint();//当前鼠标在屏幕中的位置
                const x = winStartPosition.x + (cursorPosition.x - mouseStartPosition.x);
                const y = winStartPosition.y + (cursorPosition.y - mouseStartPosition.y);
                if ((cursorPosition.x <= 100 && cursorPosition.y <= 100) && app.closeWinStatus != app.enum.closeWinStatus.prompt) {
                    closeWindowStatusChange(app.enum.closeWinStatus.prompt);//窗口移动到关闭窗口上
                } else if ((cursorPosition.x > 100 || cursorPosition.y > 100) && app.closeWinStatus != app.enum.closeWinStatus.show) {
                    closeWindowStatusChange(app.enum.closeWinStatus.show);//窗口在其他地方移动
                }
                win.setPosition(x, y, true);
            }, 10);
        } else {
            closeWindowStatusChange(app.enum.closeWinStatus.hide);//释放窗口移动，取消关闭窗口的显示
            clearInterval(movingInterval);
            movingInterval = null;
            //窗口移动到关闭窗口上关闭该窗口，主窗口不用这个关闭
            if ((screen.getCursorScreenPoint().x <= 100 && screen.getCursorScreenPoint().y <= 100) && win != mainWin.mainWindow)
                win.destroy();
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