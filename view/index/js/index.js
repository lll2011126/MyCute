import windowControl from "../../../common/custom/windowControl.js";
import newWindow from "../../../common/custom/newWindow.js";

const {remote} = require('electron');

$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#coreArea"), true);

    // 两种形态切换
    $("#coreArea").dblclick(function (e) {
        let let1 = $("#boxArea").css("opacity");
        if (let1 == 0) {
            $("#flashArea").css({
                "opacity": "0",
                "transform": "scale(0.01)"
            });
            $("#boxArea").css({
                "opacity": "1",
                "transform": "scale(1)"
            });
        }
    });
    $("#boxLeft>a img").click(function (e) {
        if (!e.altKey) {
            $("#flashArea").css({
                "opacity": "1",
                "transform": "scale(1)"
            });
            $("#boxArea").css({
                "opacity": "0",
                "transform": "scale(0)"
            });
        }
    });

    /**********************************/
    $("#boxLeft>a img").attr("src", returnOptions.icon);

    for (let option of leftOptions) {
        $("#boxLeft ul").append("<li><a href='' onclick='return false' ondragstart='return false' style='font-size: 10px'><img src='" + option.icon + "'/></a></li>");
    }

    for (let option of rightOptions) {
        $("#boxRight ul").append("<li><a windowOption='" + JSON.stringify(option.windowOption) + "' href='" + option.href + "' onclick='return false' ondragstart='return false' style='font-size: 10px' width=" + option.width + " height=" + option.height + "><img src='" + option.icon + "'/>" + option.name + "</a></li>");
    }

    $("#boxRight ul li").on('click', function (e) {
        if (e.altKey) return;
        let val = $(this).data("value");
        let _windowOption = $(this).children("a").attr('windowOption');
        let windowOption = $.parseJSON(_windowOption == 'undefined' ? '{}' : _windowOption);
        if (val == undefined || val == null || val.isDestroyed()) {
            let defaultOptions = {
                initWindow: {
                    width: Number($(this).children("a").attr('width')),
                    height: Number($(this).children("a").attr('height')),
                    frame: windowOption.frame == 'undefined' ? false : windowOption.frame
                },
                style: {
                    filePath: $(this).children("a").attr('href'),
                    openDevTools: windowOption.openDevTools == 'undefined' ? false : windowOption.openDevTools
                }
            };
            $(this).data("value", newWindow(defaultOptions));
        } else {
            val.show();
        }
    });
});

var returnOptions = {
    name: "返回",
    icon: "../../static/image/return.png"
};

var leftOptions = [
    {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    }, {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    }, {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    }, {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    }, {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    }, {
        name: "字符串",
        icon: "../../static/image/box/str.png"
    },
];

var rightOptions = [
    {
        name: "字符串",
        icon: "../../static/image/box/str.png",
        href: "../stringConvert/stringConvert.html",
        width: 1000,
        height: 700,
        // windowOption: {
        //     frame: true,
        //     openDevTools: true
        // }
    },
    {
        name: "时间戳",
        icon: "../../static/image/box/time.png",
        href: "../timeStamp/timeStamp.html",
        width: 800,
        height: 300
    },
    {
        name: "cron",
        icon: "../../static/image/box/cron.png",
        href: "../cron/toCron.html",
        width: 1000,
        height: 600
    },
    {
        name: "录制",
        icon: "../../static/image/box/record.png",
        href: "../record/record.html",
        width: 1000,
        height: 600
    },
    {
        name: "压缩",
        icon: "../../static/image/box/picture.png",
        href: "../picture/picture.html",
        width: 1000,
        height: 600
    },
    {
        name: "计划",
        icon: "../../static/image/box/time.png",
        href: "../note/note.html",
        width: remote.app.screenWidth - 600,
        height: remote.app.screenHeight - 500,
        windowOption: {
            frame: true,
            openDevTools: true
        }
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }, {
        name: "aaa",
        icon: "../../static/image/box/str.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }, {
        name: "aaa",
        icon: "../../static/image/box/str.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }, {
        name: "aaa",
        icon: "../../static/image/box/str.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }, {
        name: "aaa",
        icon: "../../static/image/box/str.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }, {
        name: "aaa",
        icon: "../../static/image/box/str.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    },
    {
        name: "bbb",
        icon: "../../static/image/box/time.png"
    }
];
