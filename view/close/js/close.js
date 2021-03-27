import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');
$(document).ready(function () {
    let thisWindow = remote.getCurrentWindow();
    //这个窗口不用点击，添加鼠标穿透
    windowControl.click(thisWindow, $('#x'));

    thisWindow.on('show', () => {
        if (remote.app.closeWinStatus == remote.app.enum.closeWinStatus.show) {
            $('#x').css('width', '100px');
            $('#x').css('height', '100px');
            $('#x').css('border-radius', '0 0 100px 0');
            $('#x').css('background-color', '#E6E6FAA0');
            $('#x').css('box-shadow', '0 0 30px #E6E6FAA0');

            $('.x').css('width', '100px');
            $('.x').css('height', '100px');
            $('.x').css('transform', 'translate(-20%, 0) rotate(90deg)');
        } else if (remote.app.closeWinStatus == remote.app.enum.closeWinStatus.hide) {
            $('#x').css('width', '0');
            $('#x').css('height', '0');
            $('#x').css('border-radius', '0 0 100px 0');
            $('#x').css('background-color', '#F8F8FF00');
            $('#x').css('box-shadow', '0 0 30px #F8F8FF00');

            $('.x').css('width', '0');
            $('.x').css('height', '0');
            $('.x').css('transform', 'translate(-20%, 0) rotate(-90deg)');
        } else if (remote.app.closeWinStatus == remote.app.enum.closeWinStatus.prompt) {
            $('#x').css('width', '130px');
            $('#x').css('height', '130px');
            $('#x').css('border-radius', '0 0 130px 0');
            $('#x').css('background-color', '#FFC0CBA0');
            $('#x').css('box-shadow', '0 0 30px #FFC0CBA0');

            $('.x').css('width', '130px');
            $('.x').css('height', '130px');
        }
    });

});
