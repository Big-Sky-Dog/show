$(function () {
    //淡入淡出底部加盟
    $(window).scroll(function () {
        if($(window).scrollTop()>=400){
            $('.joinfoot').fadeIn();
        }else {
            $('.joinfoot').fadeOut();
        }
    });
    //banner图上加盟事件
    // 弹出框
    $('.jiameng').click(function () {
        $("#tanchu").css({"display": "block"});
    });

    // 点击加盟弹出加盟框
    $('#joinfoot').click(function () {
        $('#tanchu').css({"display":'block'})
    });

    // 弹出框
    $('#xianshi').click(function () {
        $("#tanchu").css({"display": "block"});
    });
    // 关闭弹出框
    $('#yincang').click(function () {
        $("#tanchu").css({"display": "none"});
    });
    //向后台传数据
    $('#kefubtn').click(function () {
        var name = $('#kefuname').val();
        var phone = $('#kefuphone').val();
        var di =$('#di').val();
        var rad = $('input:radio[name="jm"]:checked').val();
        var rad1 = $('input:radio[name="sq2"]:checked').val();
        var source = $('#source2').val();
        //正则验证用户名
        var username = /^[\u4E00-\u9FA5A-Za-z]+$/;
        //正则验证手机号
        var pat = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
        if (!username.test(name)) {
            alert("请输入名字");
        } else if (!pat.test(phone)) {
            alert('请输入正确的手机号');
        } else {
            $.ajax({
                type: 'get',
                url: 'http://khly.pay5858.com/joinmsg/addjoinmsg',
                data: {'user':name,'phone':phone,'address':di,'type':rad,'item':rad1,'source':source},
                dataType: 'jsonp',
                // success: function(data){
                //     alert("提交成功");
                // }
            });
            alert('提交成功');
            $('#tanchu').css({'display':'none'});
            $('#kefuname').val('');
            $('#kefuphone').val('');
            $('#di').val('');
        }
    });

    //可拖拽
    var box = document.getElementById("tanchu");
    var drop = document.getElementById("drop");
    drop.onmousedown = function (event) {
        //获取鼠标在页面中的位置
        var event = event || window.event;
        var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
        var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
        //鼠标在按下的那一瞬间在盒子中的位置
        var mouseboxX = pageX - box.offsetLeft;
        var mouseboxY = pageY - box.offsetTop;
        document.onmousemove = function (event) {
            var event = event || window.event;
            var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
            box.style.left = pageX - mouseboxX + "px";
            box.style.top = pageY - mouseboxY + "px";
            //清除选中文字
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    }
    drop.onmouseup = function () {
        document.onmousemove = null;
    }
});