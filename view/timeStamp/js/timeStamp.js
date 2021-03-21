import windowControl from "../../../common/custom/windowControl.js";
import dbUtil from "../../../common/custom/dbUtil.js";

const {remote} = require('electron');
const {clipboard} = require('electron');

$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#content"), false, true);
    windowControl.stopPropagations([$("input[type='button']"), $("input[type='text']"), $("select")]);

    // 当前时间 两种
    let var1 = setInterval(function () {
        let date = new Date();
        $($("#nowDate").find("label").eq(0)).text(Math.floor(date.getTime() / 1000));
        $($("#nowDate").find("label").eq(1)).text(dbUtil.nowDate(date));
    }, 1000);

    $("#nowDate").find("label").click(function () {
        clipboard.writeText($(this).text());
    });

    //时间戳转时间
    $("#toTime").click(function (e) {
        //获得输入框内容
        let val = $($("#toTimeForm").find("input[type='text']")[0]).val();
        //选择框
        let index = $($("#toTimeForm").find('select')[0]).find('option:selected').index();
        //处理秒和毫秒
        let date = new Date(parseInt(index == 0 ? val * 1000 : val));
        //赋值
        $($("#toTimeForm").find("input[type='text']")[1]).val(dbUtil.nowDate(date));
    });

    // 时间转时间戳
    $("#timeTo").click(function (e) {
        //获得输入框内容
        let val = $($("#timeToForm").find("input[type='text']")[0]).val();
        //选择框
        let index = $($("#timeToForm").find('select')[0]).find('option:selected').index();
        //转换
        let tt = new Date(val).getTime();
        //赋值
        $($("#timeToForm").find("input[type='text']")[1]).val(index == 0 ? tt / 1000 : tt);
    });
});