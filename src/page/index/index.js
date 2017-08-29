'use strict';



var tools = require('util/tool.js');
require('./index.css');
require('../window/index.js');

var page = {
    init : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function () {

    },
    bindEvent : function () {
        // 返回URL地址
        var gameId = tools.getUrlParam('id')        //获取区服ID
        var gid = '';
        $.get('/api/h5/game/play',{id:9},function (data) {
            $('.class-iframe').attr('src',data.url)
            gid = data.gid
        },'JSON')

        //如果从iframe收到message,显示支付页面
        var order = "";
        window.addEventListener("message", function (event) {
            if (event.data.amount > 0) {
                console.log(event);
                order = event.data;
                console.log("Hello from " + event.data);
                console.log("Hello from " + event.data.name);
                $('#pay-box').css('display', 'block');
                $('#pname').html(event.data.name);
                $('#price').html('¥ ' + event.data.amount);
            }

        });
        var windowControl = {
            payClose: function () {
                $('#pay-box').css('display', 'none');
            },
            ruleClose: function () {
                $('#dialogBox').css('display', 'none');
            },
            urleOpen: function () {
                $('#dialogBox').css('display', 'block');

                $("#backBanner").attr("src", "url")
                console.log(url);
            },
            starting: function () {
                order.paytype = 'wechat';
                $.post('api/h5/Pay/beginpay', order, function (result) {
                    if (result.code === 1) {
                        if (result.code_url) {
                            /*二维码支付*/
                            $('#ewm').attr('src', "http://www.kukewan.com/pay/png?url=" + result.code_url);
                            $('#saoma').show();
                            //定时发送请求检查订单状态
                            console.log(order.oid + "shibai" + result.show)
                            //todo
                            checkpay(order.oid)
                        } {
                            wechatpay(result.data);//公众号支付
                        }

                    } else {
                        console.log(result.code + "shibai" + result.show)
                        alert(result.show)
                    }
                }, 'json');

            }
        }
        function checkpay(oid) {
            var s = setInterval(function () {
                $.get('/api/h5/pay/checkpay/order/' + oid, function (data) {
                    if (data == 1) {
                        $('#pay-box').css('display', 'none');
                        $('#saoma').hide();
                        clearInterval(s);
                    }
                });
            }, 2000)
        }
        $.get('/api/h5/index/gamead', function (data) {
            var url = data.slide_pic
            $('#backBanner').attr('src', url)
        });

        //返回按钮实现

        var layers = {
            //获取banner图片
            bg: function () {
                $.get('/api/h5/index/gamead', function (data) {

                    var url = data.slide_pic
                });
                return url
            },
            //弹出提示框
            open: function () {
                $('.back').css('display', 'block');

                console.log(url)

                console.log('ok')
            },
            close: function () {
                $('.back').css('display', 'none');
            },
            leave: function () {
                if (isWechat()) {
                    WeixinJSBridge.call('closeWindow')
                } else {
                    window.location.href = '/'
                }

            },
        }
        $('.back-btn-close').click(function () {
            layers.close()
        })
        $('.back-btn-leave').click(function () {
            layers.leave()
        })

        //判断是否是微信浏览器
        function isWechat() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) === 'micromessenger') {
                console.log('是微信浏览器')
                return true
            } else {
                console.log('不是微信浏览器')
                return false
            }
        }
        //设置cookie


        $(".noAlert").click(function () {
            if ($('#selectOneDay').attr('checked')) {
                console.log('delete cookie')
                $.removeCookie('oneday', {path: '/'})
                $('#selectOneDay').removeAttr('checked')
            } else {
                $('#selectOneDay').attr('checked', 'checked')
                console.log('开始设置cookie')
                $.cookie('oneday', 'abc', {path: '/', expires: 1})
                console.log('OK')
            }

        })


        pushHistory();

        window.top.addEventListener("popstate", function (e) {  //回调函数中实现需要的功能
            e.preventDefault()

            if (!$.cookie("oneday")) {
                console.log(history.length)
                layers.open()
            }

        }, false);

        function pushHistory() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, state.title, state.url);
        }
        $('#closeSaoma').click(function (event) {
            $("#saoma").css('display', 'none');
            clearInterval(s);
        });
        /*点击数量*/
        $('.game-list').click(function (event) {
            var $target = event.target;
            if ($($target).attr('data-url') === '/') {
                window.location.href = '/'
            }
            console.log($target.nodeName)
            if ($target.nodeName === 'IMG') {
                $.ajax({
                    url: '/api/h5/index/buttonClick',
                    type: 'GET',
                    dataType: 'JSON',
                    data: {
                        name: $($target).attr('data-name'),
                        type: $($target).attr('data-type'),
                        url: $($target).attr('data-url')
                    },
                    success: function (res) {
                        window.location.href = $($target).attr('data-url');
                    },
                    error: function (errorMsg) {
                        console.log(errorMsg);
                        // window.location.href =  $($target).attr('data-url');
                    }
                })
            }
        });



        $.get('/api/h5/index/getwechatsdkconf?route='+ encodeURIComponent(window.location.pathname+window.location.search),function (data) {
            console.log(data)
            wx.config(data)
            /*s*/
            $.get('/api/h5/game/gameinfo/',{gid : gid},function (data) {
                wx.onMenuShareTimeline({
                    title: data.name, // 分享标题
                    link: window.location.protocol + "//" + window.location.host + data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: data.img, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.get('/api/Integral/Task/share',function(data){
                            if(data === '200'){

                            }
                        },'JSON')
                    },
                    cancel: function () {
                        alert('用户取消分享后执行的回调函数!')
                        // 用户取消分享后执行的回调函数
                    },
                    error:function () {
                        alert('失败')
                    }

                })
            },'JSON')

            /*e*/
        },'JSON')


        /**
         * 微信付款
         * @param $attr 付款参数
         */
        function wechatpay($attr) {
            windowControl.payClose()
            function onBridgeReady() {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', $attr,
                    function (res) {
                        if (res.err_msg === "get_brand_wcpay_request:ok") {
                        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    }
                );
            }

            if (typeof WeixinJSBridge === "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        }


    }
}
$(function () {
    page.init()
})