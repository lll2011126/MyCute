import windowControl from "../../../common/custom/windowControl.js";

const {remote} = require('electron');
const fs = require("fs");
const {dialog} = require('electron').remote;

$(document).ready(function () {
    const thisWindow = remote.getCurrentWindow();
    windowControl.move(thisWindow, $("#main"), false, true);

    //设置画布大小比列和真实大小一样
    $("#canvas").attr("width", $('#canvas').width()).attr("height", $('#canvas').height());

    //添加动画
    $("#canvas").on('dragenter', function (e) {
        e.preventDefault();
        $("#holder").addClass('holder-ondrag');
    });

    $("#canvas").on('dragleave', function (e) {
        e.preventDefault();
        $("#holder").removeClass('holder-ondrag');
    });

    //不可缺少，屏蔽浏览器原有的动作
    $("#holder").on('dragover', function (e) {
        e.preventDefault();
    });

    var canvas = $('#canvas').get(0);
    let canvasWidth = $("#canvas").attr("width");
    let canvasHeight = $("#canvas").attr("height");

    var hiddenCanvas = $('#hiddenCanvas').get(0);

    var imageRealWidth;
    var imageRealHeight;

    var lastImage;
    //加载图片
    $("#holder").on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('holder-ondrag');

        let file = e.originalEvent.dataTransfer.files[0];
        let image = new Image();
        image.src = file.path;

        $(image).on("load", function () {
            $("#canvas").attr("height", $('#canvas').height());//清空画布
            imageRealWidth = image.width;
            imageRealHeight = image.height;

            $("#hiddenCanvas").attr("width", imageRealWidth).attr("height", imageRealHeight);//设置真实隐藏画布大小

            var newWidth;
            var newHeight;
            if (imageRealWidth > canvasWidth || imageRealHeight > canvasHeight) {
                let a = canvasWidth / imageRealWidth;
                let b = canvasHeight / imageRealHeight;
                if (a < b) {
                    newWidth = Math.floor(canvasWidth);
                    newHeight = Math.floor(imageRealHeight * a);
                } else {
                    newWidth = Math.floor(imageRealWidth * b);
                    newHeight = Math.floor(canvasHeight);
                }
            }
            canvas.getContext('2d').drawImage(this, 0, 0, newWidth, newHeight);//在画布上显示
            hiddenCanvas.getContext('2d').drawImage(this, 0, 0, imageRealWidth, imageRealHeight);//在隐藏画布上绘制
        });
    });

    $('#compress').click(function (e) {
        let data = hiddenCanvas.toDataURL('image/jpeg', 1);
        SaveDialog(data);
    });
});


function SaveDialog(data) {
    dialog.showSaveDialog({
        title: "请选择要保存的位置",
        buttonLabel: "保存",
        defaultPath: new Date().getTime() + '.jpg',
        filters: [
            {name: 'image/jpeg', extensions: ['jpg']},
        ]
    }).then(result => {
        let base64 = data.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
        let dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
        console.log(dataBuffer.length);
        fs.writeFile(result.filePath, dataBuffer, "binary", function (err) {
            if (err) {
                console.log("An error occurred creating the file :" + err.message)
            } else {
                console.log("The file has been successfully saved")
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

// let data = canvas.toDataURL('image/jpeg', 0.1);
// canvas.getContext('2d').drawImage(dataUrl2Image(data), 0, 0, newWidth, newHeight);
//
// function dataUrl2Image(dataUrl) {
//     var image = new Image();
//     image.src = dataUrl;
//     return image;
// }
