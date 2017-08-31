require('./index.css');
var _tool = require('util/tool.js')
var _window = require('service/window-service.js');
var packageHtml = require('./package.string');
var moreGmaeHtml = require('./more-game.string');
var page = {
    data : {
        gameId : ''      //游戏ID
    },
    init : function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function () {
        var _this = this;
        var $windowMainHeaderImage = $('#windowMainHeaderImage');   //用户头像
        var $windowUsername        = $('#windowUsername');          //用户名
        var $windowId              = $('#windowId');                //用户ID
        var $windowWrap            = $('#windowWrap');              //窗口
        var $float                 = $('#float');                   //悬浮球
        var $windowMainNav         = $('#windowMainNav');           //导航
        var $windowMainList        = $('#windowMainList');          //导航列表
        var $windowMainNavItem     = $('.window-main-nav-item');    //导航列表的集合
        //获取用户信息
        $.get('/api/h5/user/getUserinfo',function (res) {
            if (res.user === null) {
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href)
            }
            $windowMainHeaderImage.attr('src',res.user.avatar);
            $windowUsername.text(res.user.user_nicename);
            $windowId.text(res.user.id);
        })
        //加载存桌面

        //微信和Android登录
        if(!_tool.isSafari()){
            this.cancelSaveWindow();
        }
        //IOS登录
        /*else{
            //判断token是否存在
            if (_tool.getUrlParam('token')){
                // this.cancelSaveWindow();
                // quickLogin 是否有qd_code
                if (_tool.getUrlParam('qd_code')){
                    //验证token是否失效
                    $.get('/api/h5/game/quickLogin',{
                        token : _tool.getUrlParam('token'),
                        qd_code : _tool.getUrlParam('qd_code')
                    },function(data){
                        if (data.code !== 2000){
                            window.location.href = 'http://h5.wan855.cn/login'+_tool.getUrlParam('token');
                        }

                        // 判断是否是第一次进行保存操作
                        _this.firstSaveWindow();

                    },'JSON')
                }else{
                    //验证token是否失效
                    $.get('/api/h5/game/quickLogin',{
                        token : _tool.getUrlParam('token')
                    },function(data){
                        if (data.code !== 2000){
                            window.location.href = 'http://h5.wan855.cn/login'+_tool.getUrlParam('token');
                        }

                        // 判断是否是第一次进行保存操作

                        _this.firstSaveWindow()
                    },'JSON')
                }
            }
            //token不存在的情况
            else {
                $('#saveWindowBtn').click(function () {
                    $.get('/api/h5/game/token',{
                        gid : _this.data.gameId,
                        sid : _tool.getUrlParam('id')
                    },function (data) {
                        var token = data.token;
                        // var theHtml = window.location.href + '&token=' + token;
                        var theHtml = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + '&token=' + token;
                        console.log(theHtml);
                        //重新加载页面
                        window.location.href = theHtml;
                    },'JSON')
                })
            }
        }*/
        //加载礼包内容
        var serverId = _tool.getUrlParam('id')        //获取区服ID
        $.get('/api/h5/game/play',{id:serverId},function (data) {
            _this.data.gameId = data.gid
            $.get('/api/h5/game/cardlist',{gid:_this.data.gameId},function (data) {
                var html = '';
                //将对象转换成数组
                data.gift = _tool.transformArray(data.gift)
                html = _tool.renderHtml(packageHtml,data);
                $('#packageWrap').html(html);
            },'JSON')
        },'JSON');

        //加载更多游戏
        $.get('/api/h5/game/hot',function (data) {
            var html = '';
            var dataJson = {
                game : data
            }
            console.log(dataJson)
            html = _tool.renderHtml(moreGmaeHtml,dataJson);
            $('#moreGameWrap').html(html);
        },'JSON')


    },
    bindEvent : function () {
        var $windowWrap       = $('#windowWrap');
        var $windowCollection = $('#windowCollection');
        var $windowClose      = $('#windowClose');
        var $windowRefresh    = $('#windowRefresh');
        var $float            = $('#float');
        var $windowCollection = $('#windowCollection');
        var _this = this;
        //收藏
        $windowCollection.click(function () {
            $.get('/api/h5/game/favorite',{gid:_this.data.gameId,sid:_tool.getUrlParam('id')},function (data) {
                if (data.code === 2000){
                    layer.msg(data.msg);
                    console.log(data.msg);
                }else{
                    layer.msg(data.msg);
                }
            },'JSON')
        })

        //关闭
        $windowClose.click(function () {
            $windowWrap.hide();
            $float.show();
        })
        //刷新
        $windowRefresh.click(function () {
            window.location.reload();
        })

        $windowMainNavItem = $('.window-main-nav-item');
        $windowMainItem = $('.window-main-item');

        $windowMainNavItem.each(function (i) {
            $(this).click(function () {
                //切换导航样式
                $windowMainNavItem.removeClass('window-main-nav-item-active');
                $(this).addClass('window-main-nav-item-active');
                // 切换主内容
                $windowMainItem.removeClass('window-main-item-active')
                $windowMainItem.eq(i).addClass('window-main-item-active');
            })
        })

    },
    cancelSaveWindow : function () {
        $('#windowMainNav li:eq(2)').hide();
        $('#windowMainList li:eq(2)').hide();
    },
    //判断是否是第一次进行存桌面操作
    firstSaveWindow : function () {
        var $windowWrap            = $('#windowWrap');              //窗口
        var $float                 = $('#float');                   //悬浮球
        if (!localStorage.getItem('first')){
            //第一次
            localStorage.setItem('first',1);
            //加上token参数后打开window面板
            $windowWrap.show();
            $float.hide();
            //调整到存桌面选项卡
            $windowMainNavItem.removeClass('window-main-nav-item-active');
            $('#windowMainNav li:eq(2)').addClass('window-main-nav-item-active')
            $('#windowMainList li:eq(2)').addClass('window-main-item-active')
        }
    }
}
$(function () {
    page.init();
})