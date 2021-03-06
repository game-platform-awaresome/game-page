'use strict';



var tools = require('util/tool.js');
require('./index.css');
require('../window/index.js');

var page = {
    init : function(){
        // token -> PHPSESSION  
        if (tools.getUrlParam('token')) {
            $.cookie('PHPSESSID', null)
            $.cookie('PHPSESSID', tools.getUrlParam('token'), {
                expires: 90,
                path: '/'
            })
            // window.location.onLoad()
        }
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function () {
        if(tools.isWechat()){
            $('.paytype-alipay').css('display','none');
        }
        setTimeout(function () {
            $(".game-loading").css({
                display:"none"
            });
        },4000);
    },
    bindEvent : function () {
        var $weiduanBtn = $('.weiduan-btn')     //打开二维码按钮
        var $weiduanCode = $('.weiduan-code')   //二维码窗口
        var $weiduanQrCode = $('#weiduanQrCode')            //微端二维码
        var $closeQrCodeBtn = $('.close-qr-code-btn')
        var _this = this;
        var obj = {};
        var serverId = tools.getUrlParam('id');        //获取区服ID
        obj.id = serverId;
        if(tools.getUrlParam('qd_code')){
            obj.qd_code = tools.getUrlParam('qd_code');
        }
        
        var gid = '';
        // order
        var order = {};

        $weiduanBtn.click(function(){
            // 统计下载次数
            $.get('/api/h5/index/buttonClick',{
                url: encodeURIComponent(window.location.href),
                name: '扫码下载微端',
                type: '游戏页'
            },function(data){
                if(data.code === 1) {
                    console.log('统计')
                }
            },'json')
            $weiduanCode.show()
        })
        $closeQrCodeBtn.click(function(){
            $weiduanCode.hide()
        })

        // 弹窗开启与关闭
        var openAlertWindow = true
        var openPay = true
        $.get('/api/h5/game/play',obj,function (data) {
            $('.class-iframe').attr('src',data.url)
            // console.log('游戏URL'+data.url)
            gid = data.gid;
            // 判断弹窗是否开启
            if (data.pop_switch == 0) {
                openAlertWindow = false
            }
            if(data.switch == 0) {
                $('.paytype-ptb').css('display','none');
            } 
            // 顶部下载top
            if(data.title_switch == 1) {
                $('.top').addClass('download-top')
                $('.game-play-page').addClass('download-page')
            }
            // 游戏页气泡开关
            if (data.bubble_switch == 1) {
                $('#float').show()
            }
            // 控制支付功能
            if (data.pay_status == 0) {
                openPay = false
            }
            // 控制支付宝
            if (data.wxpay_switch == 0) {
                $('.paytype-wechat').remove()
            }
            // 控制微信支付
            if (data.alipay_switch == 0) {
                $('.paytype-alipay').remove()
            }
            $("#size57").attr('href',data.icon_list.icon_57);
            $("#size72").attr('href',data.icon_list.icon_72);
            $("#size144").attr('href',data.icon_list.icon_144);
            // 二维码按钮
            // $weiduanBtn.css('text-shadow','2px 1px 20px rgb(251,254,4)')
            // $weiduanBtn.css('color','#000')
            // $weiduanBtn.text(data.game_info.game_name + '微端下载')
            // 调用生成二维码
            $weiduanQrCode.attr('src','https://api.qrserver.com/v1/create-qr-code?data='+data.scan_url)
        
            // init data-type pay-select-active
            $("#pay-list li").eq(0).find('span').addClass('pay-select-active');
            order.dataType = $("#pay-list li").eq(0).attr('data-type');
        
        },'JSON')

        //如果从iframe收到message,显示支付页面
        

        

        if (openPay) {
            window.addEventListener("message", function (event) {
            if (event.data.amount > 0) {

                    order = event.data;
                    order.dataType = $("#pay-list li").eq(0).attr('data-type');
                    $('#pay-box').css('display', 'block');
                    $('#pname').html(event.data.name);
                    $('#price').html('¥ ' + event.data.amount);
                }

            });
        }
        
        

        //改变支付类型
        $("#pay-list li").click(function () {
            order.paytype = $(this).attr('data-type');
            $("#pay-list li").find('span').removeClass('pay-select-active');
            $(this).find('span').addClass('pay-select-active');
            if(order.paytype === 'wechat') {
                $('.pay-box-tit span').html('微信')
                $('.pay-box-bottom').html('请使用[微信扫一扫]支付')
            }else if(order.paytype === 'alipay') {
                $('.pay-box-tit span').html('支付宝')
                $('.pay-box-bottom').html('请使用[支付宝扫一扫]支付')
            }
            
        })


        var windowControl = {
            payClose: function () {
                $('#pay-box').css('display', 'none');
            },
            ruleClose: function () {
                $('#dialogBox').css('display', 'none');
            },
            ruleOpen: function () {
                $('#dialogBox').css('display', 'block');

                $("#backBanner").attr("src", "url")
            },
            starting: function () {
                checkpay(order.oid)

                if (tools.isXCX()) {
                    order.paytype = 'minipay'
                }
                $.post('/api/h5/Pay/beginpay', order, function (result) {
                    if (tools.isXCX()) {
                        if (tools.isAndroid()) {
                            //order为支付接口返回的参数
                            var data = {
                                jsParams: result.data
                            };
                            var params = '?timestamp=' + data.jsParams.timeStamp + '&nonceStr=' + data.jsParams.nonceStr + '&prepay_id=' + data.jsParams.prepay_id + '&signType=' + data.jsParams.signType + '&paySign=' + data.jsParams.paySign + '&appId=' + data.jsParams.appId + '&uid=' + data.jsParams.uid + '&place_order_time=' + data.jsParams.place_order_time + '&total_money=' + data.jsParams.total_money + '&order_des=' + data.jsParams.order_des + '&game_name=' + data.jsParams.game_name; //定义path 与小程序的支付页面的路径相对应
                            var path = '/pages/minipay/minipay' + params; //通过JSSDK的api使小程序跳转到指定的小程序页面
                            wx.miniProgram.navigateTo({
                                url: path
                            });
                        } else {
                            alert('暂不支持IOS设备')
                        }
                    }


                    if (result.code === 1) {
                        if (result.code_url) {
                            /*二维码支付*/
                            $('#ewm').attr('src', "https://api.qrserver.com/v1/create-qr-code?data=" + result.code_url);
                            $('#saoma').show();
                            //定时发送请求检查订单状态
                            //todo
                            
                        }else if (result.mweb_url){
                            window.location.href = result.mweb_url;
                        }else{
                            wechatpay(result.data);//公众号支付
                        }

                    }else if(result.code === 2000){
                        $("#alipay-content").html(result.form);
                    } else if(result.code === 0){
                        alert(result.msg)
                    } else if(result.code === 200) {
                        alert(result.msg)
                    }
                }, 'json');
            }
        };

        //绑定支付
        $('#readyPay').click(function () {
            windowControl.starting();
        })
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
        //条例
        $('#rulesOpen').click(function () {
            windowControl.ruleOpen();
        })
        //关闭扫码
        $('#closeSaoma').click(function () {   
            $('#saoma').hide();
        });
        //关闭充值
        $('#payClose').click(function () {
            windowControl.payClose();
        })
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

                // console.log('ok')
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
        $('.back-btn-fault').click(function () {
            layers.close()
        })
        $('.back-btn-leave').click(function () {
            layers.leave()
        })

        //判断是否是微信浏览器
        function isWechat() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) === 'micromessenger') {
                // console.log('是微信浏览器')
                return true
            } else {
                // console.log('不是微信浏览器')
                return false
            }
        }
        //设置cookie


        $(".noAlert").click(function () {
            if ($('#selectOneDay').attr('checked')) {
                // console.log('delete cookie')
                $.removeCookie('oneday', {path: '/'})
                $('#selectOneDay').removeAttr('checked')
            } else {
                $('#selectOneDay').attr('checked', 'checked')
                // console.log('开始设置cookie')
                $.cookie('oneday', 'abc', {path: '/', expires: 1})
                // console.log('OK')
            }

        })


        pushHistory();

        window.top.addEventListener("popstate", function (e) {  //回调函数中实现需要的功能
            if (openAlertWindow) {
                e.preventDefault()

                if (!$.cookie("oneday")) {
                    // console.log(history.length)
                    layers.open()
                }
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
            $("#saoma").hide();
            clearInterval(s);
        });
        /*点击数量*/
        $('.game-list').click(function (event) {
            var $target = event.target;
            if ($($target).attr('data-url') === '/') {
                window.location.href = '/'
            }
            // console.log($target.nodeName)
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