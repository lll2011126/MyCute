import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');
$(document).ready(function () {
    let thisWindow = remote.getCurrentWindow();
    windowControl.click(thisWindow, $('div'));
    $('div').on('mouseenter', () => {
    });


    $('div').on('mouseleave', () => {
    });
    thisWindow.on('show', (event) => {
        if (remote.app.dir == 1) {
            $('div').css('width', '100px');
            $('div').css('height', '100px');
            $('div').css('background-color', '#F8F8FFA0');
            $('div').css('box-shadow', '0 0 30px #F8F8FFA0');
        } else {
            $('div').css('width', '0');
            $('div').css('height', '0');
            $('div').css('background-color', '#F8F8FF00');
            $('div').css('box-shadow', '0 0 30px #F8F8FF00');
        }
    });
});
