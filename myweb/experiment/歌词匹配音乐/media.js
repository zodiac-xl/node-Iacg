/**
 * Created by 小龙 on 2014/7/25.
 */

var loopArray = Z.loopArray,
bindEvent = Z.bindEvent;

// 播放器
var Player = function () {

    var audio = null;

    function EventRegister(eventName) {
        return function (task) {
            bindEvent(audio, eventName, task);
        }
    }

    return function () {
        if (audio === null) {
            audio = document.createElement("audio");
            document.body.appendChild(audio);
        }
        return {
            load: function (src, onLoad) {
                audio.src = src;
                audio.load();
                audio.play();
                var event = bindEvent(audio, "loadeddata", function () {
                    event.remove();
                    onLoad(audio);
                })
            },
            onPlay: EventRegister("play"),
            onPause: EventRegister("pause"),
            onEnded: EventRegister("ended"),
            onWaiting: EventRegister("waiting"),
            onCanPlay: EventRegister("canPlay"),
            play: function () {
                audio.play();
            },
            stop: function () {
                audio.stop();
            },
            pause: function () {
                audio.pause();
            },
            replay: function () {
                audio.load();
                audio.play();
            }
        }
    }
}();

//解析歌词
function parseLrc(text) {
    var timeLine = [];
    // 解析歌词文件
    loopArray(text.split("\r"), function (line) {
        if (line !== "") {
            line = line.replace("\r", "");
            var minutes,
            seconds;
            var subTimes = line.match(/([\d]{2}:[\d]{2}.[\d]{2})/gim);
            if (subTimes) {
                var lyric = line.split("]")[line.split("]").length - 1]; // 读歌词
                loopArray(subTimes, function (subTime, i) {
                    minutes = parseInt(subTime.split(":")[0], 10);
                    seconds = parseFloat(subTime.split(":")[1]);
                    timeLine.push({
                        start: minutes * 60000 + seconds * 1000,
                        lyric: lyric,
                        pos: timeLine.length
                    });
                });
            }
        }
    });

    timeLine.sort(function (a, b) {
        //考虑同时间 原排序前者在前
        return a.start < b.start ? -1 : a.start > b.start ? 1 :
            a.pos < b.pos ? -1 : 1;
    });
    if (timeLine[0].start !== 0) {
        timeLine.unshift({
            start: 0,
            lyric: " "
        });
    }
    return timeLine;
}


function toTime(tms) {
    // 数字补零
    function str(num) {
        return ( num < 10 ? "0" : "" ) + num;
    }

    var s = tms / 1000 << 0; // 将毫秒转化为秒
    var min = s / 60 << 0; // 分钟数
    var remindSec = s - min * 60; // 余下的秒
    return str(min) + ":" + str(remindSec);
}


