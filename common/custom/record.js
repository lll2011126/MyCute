const {desktopCapturer} = require('electron');
const fs = require("fs");

/**
 *自动录屏模块*录制桌面
 *
 * @class Recorder
 */
class Recorder {

    constructor(path) {
        this.mediaOutputPath = path;
    }


    /**
     *开始录制
     *
     * @memberof Recorder
     */
    startRecord = () => {
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(
            sources=>{
                console.log(sources) // sources就是获取到的窗口和桌面数组
            })
        // desktopCapturer.getSources({
        //     types: ['screen']
        // }, (error, sources) => {
        //
        //     if (error) {
        //         throw error;
        //     }
            /* 要获取桌面音频必须设置audio约束如下 */
            navigator.mediaDevices.getUserMedia({
                audio:  {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video:   {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                        /*cursor:"never" */
                        /*取消录制鼠标，以免鼠标闪烁，这个目前标准定义了各浏览器还没实现，
                        如果需要请使用webrtc-adapter，使用最新API，
                        视频录制被单独分离成getDisplayMedia，
                        但是cursor约束条件是否有效暂时也不确定。没试过。*/
                    }
                }
            }).then(Mediastream => {
                this.getMicroAudioStream().then((audioStream)=>{
                    Mediastream.addTrack(audioStream.getAudioTracks()[0])//注！此处添加麦克风音轨无效
                    this.createRecorder(Mediastream);
                });

            }).catch(err => {
                this.getUserMediaError(err);

            })

        // })


    }

    /**
     *获取麦克风音频流
     *
     * @memberof Recorder
     */
    getMicroAudioStream=()=>{
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    }



    /**
     *获取媒体源失败
     *
     * @memberof Recorder
     */
    getUserMediaError = (err) => {
        console.log('mediaError',err);


    }


    getUserAudioError= (err) => {
        console.log('audioError',err);

    }

    /**
     *开始视频录制
     *
     * @memberof Recorder
     */
    createRecorder = (stream) => {
        console.log('start record');
        this.recorder = new MediaRecorder(stream);
        this.recorder.start();
        this.recorder.ondataavailable = event => {
            let blob = new Blob([event.data], {
                type: 'video/mkv'
            });
            this.saveMedia(blob);

        };

    }


    /**
     *数据转换并保存成MP4
     *
     * @memberof Recorder
     */
    saveMedia = (blob) => {
        console.log('saveMedia');
        let reader = new FileReader();
        let _t = this;
        reader.onload = function () {
            let buffer = new Buffer(reader.result)
            fs.writeFile(_t.mediaOutputPath, buffer, {}, (err, res) => {
                if (err) {
                    console.error(err);
                    return
                }
            })
        }
        reader.readAsArrayBuffer(blob);

    }



    /**
     *停止录制视频
     *
     * @memberof Recorder
     */
    stopRecord = () => {
        console.log('stopRecord');
        this.recorder.stop();
    }




}

export default Recorder;

