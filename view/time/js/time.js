import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');


$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#main"), false, true);

});