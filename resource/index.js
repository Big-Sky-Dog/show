
const audios = document.querySelectorAll('audio')
// const playBtn = document.querySelectorAll('.audio-left').childNodes

let arr = []
let domOne = ''
let domTwo = ''
let domThree = ''

function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

for (let i in audios) {
    audios[i].index = i

    //内容管理第4个语音
    $(document).ready(function () {
        // 控制音频文件名显示宽度
        var maxW = $('.audio-right')[i].offsetWidth;
        $('.audio-right p')[i].style = "max-width:" + maxW
        // 可能会有多个音频，逐个初始化音频控制事件
        initAudioEvent();
    });

    function initAudioEvent() {
        // 点击播放/暂停图片时，控制音乐的播放与暂停
        $('.audio-left > img')[i].onclick = function () {

            domOne = $('.audio-right > div:nth-child(2) > div')[i]
            domTwo = $('.audio-right > div:nth-child(2) > span')[i]
            domThree = $('.audio-length-current')[i]

            let obj = $('.audio-left > img')[i].src.lastIndexOf("/")
            let fileName = $('.audio-left > img')[i].src.substr(obj+1).split(".")[0]
            let number = fileName.charAt(fileName.length - 1)

            arr.unshift(i)
            if(arr.length > 2) {
                arr.pop()
            }

            // 监听音频播放时间并更新进度条
            audios[i].addEventListener('timeupdate', function () {
                updateProgress(audios[i]);
            }, false);

            // 监听播放完成事件
            audios[i].addEventListener('ended', function () {
                // 播放完成时把进度调回开始的位置
                $('.audio-right > div:nth-child(2) > div')[i].style = 'width: 0'
                $('.audio-right > div:nth-child(2) > span').style = 'left:0'
                $('.audio-length-current')[i].innerHTML = transTime(0)
                $('.audio-left > img')[i].src = './resource/pause' + number + '.png'
            }, false);

            // 改变播放/暂停图片
            if(arr.length < 2) {
                audios[i].play()

                $('.audio-left > img')[i].src = './resource/play' + number + '.png'

            } else if(arr[0] != arr[1]) {
                audios[i].play()
                audios[arr[1]].pause()
                $('.audio-left > img')[i].src = './resource/play' + number + '.png'
                
                let obj2 = $('.audio-left > img')[arr[1]].src.lastIndexOf("/")
                let fileName2 = $('.audio-left > img')[arr[1]].src.substr(obj2 + 1).split(".")[0]
                let number2 = fileName2.charAt(fileName2.length - 1)
                $('.audio-left > img')[arr[1]].src = './resource/pause' + number2 + '.png'

            } else {
                if(audios[i].currentTime.toFixed(1) == audios[i].duration.toFixed(1)) {
                    audios[i].play()
                    $('.audio-left > img')[i].src = './resource/play' + number + '.png'
                } else {
                    audios[i].pause()
                    arr = []
                    $('.audio-left > img')[i].src = './resource/pause' + number + '.png'
                }
            }
            
        };

        // 点击进度条跳到指定点播放
        // PS：此处不要用click，否则下面的拖动进度点事件有可能在此处触发，此时e.offsetX的值非常小，会导致进度条弹回开始处（简直不能忍！！）
        let doms1 = $('.audio-right > div:nth-child(2)')
        doms1[i].onmousedown = function (e) {
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            if (!audios[i].paused || audios[i].currentTime != 0) {
                var pgsWidth = doms1[i].offsetWidth;
                var rate = e.offsetX / pgsWidth;
                console.log(pgsWidth, rate, audios[i].duration)
                audios[i].currentTime = audios[i].duration * rate;
                updateProgress(audios[i]);
            }
        }

        var dot = $('.audio-right > div:nth-child(2) > span')

        // 鼠标拖动进度点时可以调节进度
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        // 鼠标按下时
        dot[i].onmousedown = function (event) {

            domOne = $('.audio-right > div:nth-child(2) > div')[i]
            domTwo = $('.audio-right > div:nth-child(2) > span')[i]
            domThree = $('.audio-length-current')[i]

            if (!audios[i].paused || audios[i].currentTime != 0) {
                var oriLeft = dot[i].offsetLeft;
                var mouseX = event.clientX;
                var maxLeft = oriLeft; // 向左最大可拖动距离
                var maxRight = doms1[i].offsetWidth - oriLeft; // 向右最大可拖动距离

                // 禁止默认的选中事件（避免鼠标拖拽进度点的时候选中文字）
                if (event && event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }

                // 禁止事件冒泡
                if (event && event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }

                // 开始拖动
                document.onmousemove = function (event) {
                    var length = event.clientX - mouseX;
                    if (length > maxRight) {
                        length = maxRight;
                    } else if (length < -maxLeft) {
                        length = -maxLeft;
                    }
                    var pgsWidth = doms1[i].offsetWidth;
                    var rate = (oriLeft + length) / pgsWidth;
                    audios[i].currentTime = audios[i].duration * rate;
                    updateProgress(audios[i]);
                };

                // 拖动结束
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        };
    }

    /**
     * 更新进度条与当前播放时间
     * @param {object} audio - audio对象
     */
    function updateProgress(audio) {
        var value = audio.currentTime / audio.duration;
        domOne.style = 'width:' + value * 100 + '%'
        domTwo.style = 'left:' + value * 100 + '%'
        domThree.innerHTML = transTime(audio.currentTime);
    }
}