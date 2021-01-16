import windowControl from "../../../common/custom/windowControl.js";
import Recorder from "../../../common/custom/record.js";

const {remote} = require('electron');

$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#main"), false, true);

    var var1=new Recorder('C:\\Users\\64381\\Desktop\\aaaa.mp4') ;

    $("#start").click(function (e) {
        var1.startRecord();
    });

    $("#stop").click(function (e) {
        var1.stopRecord();
    });
});
