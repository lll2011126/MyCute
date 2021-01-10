import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');
const {clipboard} = require('electron')

$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#main"), false, true);
    $("input[type='button']").bind('mousedown', function (event) {
        event.stopPropagation();
    });
    $("input[type='text']").bind('mousedown', function (event) {
        event.stopPropagation();
    });
    $("select").bind('mousedown', function (event) {
        event.stopPropagation();
    });

    // 当前时间 两种
    var var1 = setInterval(function () {
        let date = new Date();
        $($("#now").children()[0]).text(Math.floor(date.getTime() / 1000));
        $($("#now").children()[1]).text(date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8));
    }, 1000);

    $("#now").children().click(function () {
        clipboard.writeText($(this).text());
    });

    //时间戳转时间
    $("#toTime").click(function (e) {
        //获得输入框内容
        let val = $($($("#main").children()[1]).children("input[type='text']")[0]).val();
        //选择框
        let index = $($($("#main").children()[1]).children('select')[0]).find('option:selected').index();
        //处理秒和毫秒
        val = index == 0 ? val * 1000 : val;
        //转换
        let tt = new Date(parseInt(val)).toLocaleDateString().replace(/\//g, "-") + " " + new Date(parseInt(val)).toTimeString().substr(0, 8);
        //赋值
        $($($("#main").children()[1]).children("input[type='text']")[1]).val(tt);
    });

    // 时间转时间戳
    $("#timeTo").click(function (e) {
        //获得输入框内容
        let val = $($($("#main").children()[2]).children("input[type='text']")[0]).val();
        //选择框
        let index = $($($("#main").children()[2]).children('select')[0]).find('option:selected').index();
        //转换
        let tt = new Date(val).getTime();
        //处理秒和毫秒
        tt = index == 0 ? tt / 1000 : tt;
        //赋值
        $($($("#main").children()[2]).children("input[type='text']")[1]).val(tt);
    });
});