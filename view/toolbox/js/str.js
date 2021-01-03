import createNewWin from "./../../../common/custom/createNewWin.js"
import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');

$(document).ready(function () {
    windowControl.move(remote.getCurrentWindow(), $("#main"), false,true);

    $("textarea").bind('mousedown', function(event) {
        event.stopPropagation();
    });
});