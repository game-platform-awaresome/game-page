'use strict';

require('./index.css')


var page = {
    init : function () {
        this.ballMove();
        this.bindEvent();
    },
    bindEvent : function () {
        var $float      = $('#float');
        var $windowWrap  = $('#windowWrap');
        $float.click(function () {
            $(this).hide();
            $windowWrap.show();
        })
    },
    ballMove : function () {
        if (this.isPc()){
            this.pcMove()
        }else{
            this.phoneMove()
        }
    },
    isPc : function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    pcMove : function () {
        var isMouseDown = false;
        var lastPoint = {};
        $("#float").on("mousedown",function(e){
            e.stopPropagation();
            // console.log('按下')

            isMouseDown = true;
            lastPoint.x = e.pageX;
            lastPoint.y = e.pageY ;

            $(this).css({
                'right':'',
                'left' : e.pageX- e.offsetX
            })
            $('iframe').css('pointer-events','none');
        })

        $('body').on("mousemove",function(e){
            e.stopPropagation();
            // console.log('执行body')
            if(isMouseDown){
                var $float = $(".float");
                var targetX = parseInt($float.css('left')) + e.pageX - lastPoint.x;
                var targetY = parseInt($float.css('top')) + e.pageY - lastPoint.y;
                //总长
                var allX = targetX + parseInt($(".float").css('width'))
                var allY = targetY + parseInt($(".float").css('height'))
                if($(window).width() >= allX  && targetX >= 0 ){
                    $float.css('left', targetX + "px");
                    lastPoint.x = e.pageX;
                }
                if($(window).height() >= allY && targetY >= 0){
                    $float.css('top', targetY + "px");
                    lastPoint.y = e.pageY;
                }
            }
        }).on("mouseup",function(e){
            e.stopPropagation();
            $('iframe').css('pointer-events','auto');

            isMouseDown = false;
            lastPoint = {}
            $('#float').css({
                'left' :'',
                'right' : 0
            })
        })
    },
    phoneMove : function () {
        var isMouseDown = false;
        var lastPoint = {};

        $("#float").on("touchstart",function(e){
            e.stopPropagation();
            // console.log('按下')
            isMouseDown = true;
            lastPoint.x = parseInt(e.targetTouches[0].pageX);
            lastPoint.y = parseInt(e.targetTouches[0].pageY) ;
            // console.log(e.targetTouches[0])
            $(this).css({
                'right':'',
                'left' : parseInt(e.targetTouches[0].pageX)- parseInt(e.targetTouches[0].offsetX)
            })
            $('iframe').css('pointer-events','none');
        })

        $('body').on("touchmove",function(e){
            e.stopPropagation();
            // console.log('执行body')
            if(isMouseDown){
                var $float = $(".float");
                var targetX = parseInt($float.css('left')) + parseInt(e.targetTouches[0].pageX) - lastPoint.x;
                var targetY = parseInt($float.css('top')) + parseInt(e.targetTouches[0].pageY) - lastPoint.y;
                //总长
                var allX = targetX + parseInt($(".float").css('width'))
                var allY = targetY + parseInt($(".float").css('height'))
                if($(window).width() >= allX  && targetX >= 0 ){
                    $float.css('left', targetX + "px");
                    lastPoint.x = parseInt(e.targetTouches[0].pageX);
                }
                if($(window).height() >= allY && targetY >= 0){
                    $float.css('top', targetY + "px");
                    lastPoint.y = parseInt(e.targetTouches[0].pageY);
                }
            }
        }).on("touchend",function(e){
            e.stopPropagation();
            $('iframe').css('pointer-events','auto');
            isMouseDown = false;
            lastPoint = {}
            $('#float').css({
                'left' :'',
                'right' : 0
            })
        })
    }
}

$(function () {
    page.init()
})