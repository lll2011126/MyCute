import windowControl from "../../../common/custom/windowControl.js";
import stringUtil from "../../../common/custom/stringUtil.js";

const {remote} = require('electron');

$(document).ready(function () {
    windowControl.move(remote.getCurrentWindow(), $("#content"), false, true);
    windowControl.stopPropagations([$("textarea"), $("a")]);

    let stringTabLabel = $("#stringTab label");
    let stringTabTextarea = $("#stringTab textarea");

    stringTabLabel.on('click', function () {
        let value = stringTabTextarea.eq(0).val();
        let index = stringTabLabel.index($(this));
        let result = '';
        switch (index) {
            case 0:
                result = stringUtil.replaceWrap(value);
                break;
            case 1:
                result = stringUtil.replaceSpace(value);
                break;
            case 2:
                result = stringUtil.replaceWrapAndSpace(value);
                break;
            case 3:
                result = stringUtil.toUpperCase(value);
                break;
            case 4:
                result = stringUtil.toLowerCase(value);
                break;
            case 5:
                result = stringUtil.hump(value);
                break;
            case 6:
                result = stringUtil.replaceWrapAndSpaceHump(value);
                break;
            case 7:
                result = stringUtil.replaceLined(value);
                break;
            case 8:
                result = stringUtil.replaceBottomLined(value);
                break;
            case 9:
                result = stringUtil.replaceLinedToBottomLined(value);
                break;
            case 10:
                result = stringUtil.replaceBottomLinedToLined(value);
                break;
            case 11:
                result = stringUtil.replaceLinedHump(value);
                break;
            case 12:
                result = stringUtil.replaceBottomLinedHump(value);
                break;
            default:
                break;
        }
        stringTabTextarea.eq(1).val(result);
    });

    let jsonTabLabel = $("#jsonTab label");
    let jsonTabTextarea = $("#jsonTab textarea");
    jsonTabLabel.on('click', function () {
        let value = jsonTabTextarea.eq(0).val();
        let index = jsonTabLabel.index($(this));
        let result = '';
        switch (index) {
            case 0:
                result = stringUtil.replaceJSONSpace(value);
                break;
            case 1:
                result = stringUtil.spreadJSON(value);
                break;
            default:
                break;
        }
        jsonTabTextarea.eq(1).val(result);
    })
});