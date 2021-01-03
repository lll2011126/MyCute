window.nodeRequire = require;
const {ipcRenderer} = window["require"]("electron");
const {remote} = require('electron');

var screenWidth = remote.app.screenWidth;
var screenHeight = remote.app.screenHeight;

var speed = 20;
var timeSpeed = 8;
var waitTime = 3000;

var waitTimeOut = null;
var windowMoveIn = null;
var windowMoveOut = null;

const windowControl = {
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
                let offX = area.offset().left;//元素的绝对位置
                let areaWidth = area.width();//元素的绝对位置
                if (windowMoveOut == null && window.getPosition()[0] + offX + areaWidth <= 1) {
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
                }
            }
        });

        area.on('mouseleave', () => {
            // window.setIgnoreMouseEvents(true, {forward: true});

            if (against) {
                //如果处于停靠位置，x=0，y=一半位置
                let offX = area.offset().left;//元素的绝对位置
                let areaWidth = area.width();//元素的绝对位置
                if (window.getPosition()[0] + offX == 0 && window.getPosition()[1] == (screenHeight - window.getSize()[1]) / 2) {
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

        //这里检查在意外情况下松开按键后界面还跟着移动的bug
        area.mousemove(function (event) {
            if (event.which != 1) {
                ipcRenderer.send("window-move-open", false);
                remote.app.clearMove();
            }

            if (against) {
                if (event.which == 1 && event.screenX <= 1) {
                    let offX = area.offset().left;//元素的绝对位置
                    window.setPosition(0 - offX, (screenHeight - window.getSize()[1]) / 2);
                    ipcRenderer.send("window-move-open", false);
                    remote.app.clearMove();
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
    click: function (window, area) {
        // //穿透其他区域
        // area.on('mouseenter', () => {
        //     window.setIgnoreMouseEvents(false);
        // });
        // area.on('mouseleave', () => {
        //     window.setIgnoreMouseEvents(true, {forward: true});
        // });
    }
};

export default windowControl;