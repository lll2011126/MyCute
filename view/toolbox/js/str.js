import createNewWin from "./../../../common/custom/createNewWin.js"
import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');

$(document).ready(function () {
    windowControl.move(remote.getCurrentWindow(), $("#main"), false, true);

    $("textarea").bind('mousedown', function (event) {
        event.stopPropagation();
    });

    var tab1 = $("#tab1~div .sectionHead");
    $(tab1.children()[0]).on('click', function () {
        let value = $(tab1.next().children()[0]).val();
        $(tab1.next().children()[1]).val(value.replace(/[\r\n]/g, ""));
    });

    $(tab1.children()[1]).on('click', function () {
        let value = $(tab1.next().children()[0]).val();
        $(tab1.next().children()[1]).val(value.replace(/\ +/g, ""));
    });

    $(tab1.children()[2]).on('click', function () {
        let value = $(tab1.next().children()[0]).val();
        $(tab1.next().children()[1]).val(value.replace(/\s+/g, ""));
    });

    $(tab1.children()[3]).on('click', function () {
        let value = $(tab1.next().children()[0]).val();
        $(tab1.next().children()[1]).val(value.toUpperCase());
    });

    $(tab1.children()[4]).on('click', function () {
        let value = $(tab1.next().children()[0]).val();
        $(tab1.next().children()[1]).val(value.toLowerCase());
    });
});