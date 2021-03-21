import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');

$(document).ready(function () {
    windowControl.move(remote.getCurrentWindow(), $("#content"), false, true);
    windowControl.stopPropagations([$("textarea"), $("a")]);
});