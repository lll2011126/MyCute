import createNewWin from "./../../../common/custom/createNewWin.js"
import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');

$(document).ready(function () {
    windowControl.move(remote.getCurrentWindow(), $("#main"), false, true);

    $("textarea").bind('mousedown', function (event) {
        event.stopPropagation();
    });

    var tab1 = $("#tab1~div .sectionHead");
    $(tab1.children()).on('click', function () {
        let index = $(this).index();
        let value = $(tab1.next().children()[0]).val();
        let result = $(tab1.next().children()[1]);

        if (index == 0) {
            result.val(value.replace(/[\r\n]/g, ""));
        } else if (index == 1) {
            result.val(value.replace(/\ +/g, ""));
        } else if (index == 2) {
            result.val(value.replace(/\s+/g, ""));
        } else if (index == 3) {
            result.val(value.toUpperCase());
        } else if (index == 4) {
            result.val(value.toLowerCase());
        } else if (index == 5) {
            result.val(value.replace(/\s+([A-Za-z])/g, function (keb, item) {
                return item.toUpperCase();
            }));
        }
    });

});