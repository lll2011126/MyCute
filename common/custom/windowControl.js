window.nodeRequire = require;
const {ipcRenderer} = window["require"]("electron");
const {remote} = require('electron');

let screenWidth = remote.app.screenWidth;
let screenHeight = remote.app.screenHeight;

let speed = 20;//移动长度
let timeSpeed = 8;//移动间隔
let waitTime = 300;//鼠标离开事件

let waitTimeOut = null;
let windowMoveIn = null;
let windowMoveOut = null;

const windowControl = {
    /**
     * 自定义移动窗口
     * @param window 窗口对象
     * @param area  鼠标作用区域
     * @param altKey 拖动是否需要按下alt
     * @param against 是否允许停靠
     */
    move: function (window, area, altKey, against) {
        //穿透其他区域
        area.on('mouseenter', () => {
            // window.setIgnoreMouseEvents(false);


            if (against) {
                //鼠标进入界面就清除等待
                if (waitTimeOut != null) {
                    clearTimeout(waitTimeOut);
                    waitTimeOut = null;
                }
                let offX = Math.floor(area.offset().left);//元素的绝对位置
                let offY = Math.floor(area.offset().top);//元素的绝对位置
                let areaWidth = area.width();
                let areaHeight = Math.floor(area.height());

                if (windowMoveOut == null) {
                    if (window.getPosition()[0] + offX + areaWidth <= 1) {
                        windowMoveOut = setInterval(() => {
                            let newX = window.getPosition()[0] + speed;
                            if (newX + offX > 0) {
                                newX = 0 - offX;
                            }
                            let newY = window.getPosition()[1];
                            window.setPosition(newX, newY);
                            if (window.getPosition()[0] + offX >= 0) {
                                clearInterval(windowMoveOut);
                                windowMoveOut = null;
                            }
                        }, timeSpeed);
                    } else if (window.getPosition()[0] + offX >= screenWidth - 1) {
                        windowMoveOut = setInterval(() => {
                            let newX = window.getPosition()[0] - speed;
                            if (newX + offX + areaWidth < screenWidth) {
                                newX = screenWidth - offX - areaWidth;
                            }
                            let newY = window.getPosition()[1];
                            window.setPosition(newX, newY);
                            if (window.getPosition()[0] + offX + areaWidth <= screenWidth) {
                                clearInterval(windowMoveOut);
                                windowMoveOut = null;
                            }
                        }, timeSpeed);
                    } else if (window.getPosition()[1] + offY + areaHeight <= 1) {
                        windowMoveOut = setInterval(() => {
                            let newY = window.getPosition()[1] + speed;
                            if (newY + offY > 0) {
                                newY = 0 - offY;
                            }
                            let newX = window.getPosition()[0];
                            window.setPosition(newX, newY);
                            if (window.getPosition()[1] + offY >= 0) {
                                clearInterval(windowMoveOut);
                                windowMoveOut = null;
                            }
                        }, timeSpeed);
                    }
                }
            }
        });

        area.on('mouseleave', () => {
            // window.setIgnoreMouseEvents(true, {forward: true});

            if (against) {
                //如果处于停靠位置，x=0，y=一半位置
                let offX = Math.floor(area.offset().left);//元素的绝对位置
                let offY = Math.floor(area.offset().top);//元素的绝对位置
                let areaWidth = area.width();
                let areaHeight = Math.floor(area.height());
                if (window.getPosition()[0] + offX == 0) {//左边
                    waitTimeOut = setTimeout(function () {
                        windowMoveIn = setInterval(() => {
                            let x = window.getPosition()[0] - speed;
                            if (x + offX + areaWidth < 1) {
                                x = 1 - offX - areaWidth;
                            }
                            let y = window.getPosition()[1];
                            window.setPosition(x, y);
                            if (window.getPosition()[0] + offX + areaWidth <= 1) {
                                clearInterval(windowMoveIn);
                                windowMoveIn = null;
                            }
                        }, timeSpeed);
                    }, waitTime);
                } else if (window.getPosition()[0] + offX + areaWidth == screenWidth) {//右边
                    waitTimeOut = setTimeout(function () {
                        windowMoveIn = setInterval(() => {
                            let x = window.getPosition()[0] + speed;
                            if (x + offX >= screenWidth) {
                                x = screenWidth - offX - 1;
                            }
                            let y = window.getPosition()[1];
                            window.setPosition(x, y);
                            if (window.getPosition()[0] + offX + 1 >= screenWidth) {
                                clearInterval(windowMoveIn);
                                windowMoveIn = null;
                            }
                        }, timeSpeed);
                    }, waitTime);
                } else if (window.getPosition()[1] + offY == 0) {//上边
                    waitTimeOut = setTimeout(function () {
                        windowMoveIn = setInterval(() => {
                            let y = window.getPosition()[1] - speed;
                            if (y + offY + areaHeight < 1) {
                                y = 1 - offY - areaHeight;
                            }
                            let x = window.getPosition()[0];
                            window.setPosition(x, y);
                            if (window.getPosition()[1] + offY + areaHeight <= 1) {
                                clearInterval(windowMoveIn);
                                windowMoveIn = null;
                            }
                        }, timeSpeed);
                    }, waitTime);
                }
            }
        });

        //移动
        area.mousedown(function (event) {
            remote.app.windowMove(window);
            if (altKey) {
                if (event.altKey)
                    ipcRenderer.send("window-move-open", true);
            } else {
                ipcRenderer.send("window-move-open", true);
            }
        });

        area.mousemove(function (event) {
            //这里检查在意外情况下松开按键后界面还跟着移动的bug
            if (event.which != 1) {
                ipcRenderer.send("window-move-open", false);
                remote.app.clearMove();
            }

            //检测是否符合停靠条件
            if (against) {
                if (event.which == 1 && !(event.screenX <= remote.app.closeWindowWidth + 10 && event.screenY <= remote.app.closeWindowHeight + 10)) {
                    let offX = Math.floor(area.offset().left);//元素的绝对位置
                    let offY = Math.floor(area.offset().top);//元素的绝对位置
                    let areaWidth = area.width();
                    //左边
                    if (event.screenX <= 1) {
                        window.setPosition(0 - offX, window.getPosition()[1]);
                        ipcRenderer.send("window-move-open", false);
                        remote.app.clearMove();
                    }

                    //右边
                    if (event.screenX >= screenWidth - 1) {
                        window.setPosition(screenWidth - offX - areaWidth, window.getPosition()[1]);
                        ipcRenderer.send("window-move-open", false);
                        remote.app.clearMove();
                    }

                    //上边
                    if (event.screenY <= 1) {
                        window.setPosition(window.getPosition()[0], 0 - offY);
                        ipcRenderer.send("window-move-open", false);
                        remote.app.clearMove();
                    }
                }
            }
        });

        area.mouseup(function (event) {
            ipcRenderer.send("window-move-open", false);
            remote.app.clearMove();
        });

        //避免移动过程中透明部分黑屏
        window.hide();
        window.show();
    },
    /**
     * 穿透非指定区域
     * @param window
     * @param area 除此之外的区域穿透
     */
    click: function (window, area) {
        //穿透全部，避免应用刚打开的时候其他部位失效
        window.setIgnoreMouseEvents(true, {forward: true});
        //穿透其他区域
        area.on('mouseenter', () => {
            window.setIgnoreMouseEvents(false);
        });
        area.on('mouseleave', (event) => {
            //添加判断，鼠标左键按下的话说明正在拖动应用
            if (event.which != 1) {
                window.setIgnoreMouseEvents(true, {forward: true});
            }
        });
    },
    /**
     * 阻止某个元素拖动
     * @param area
     */
    stopPropagation: function (area) {
        area.bind('mousedown', function (event) {
            event.stopPropagation();
        });
    },
    stopPropagations: function (areas) {
        for (let i = 0; i < areas.length; i++) {
            areas[i].bind('mousedown', function (event) {
                event.stopPropagation();
            });
        }
    }
};

export default windowControl;