require('./index.css');
var _window = require('service/window-service.js');
var packageHtml = require('./package.string');
var page = {
    init : function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function () {
        $windowMainHeaderImage = $('#windowMainHeaderImage');   //用户头像
        $windowUsername        = $('#windowUsername');          //用户名
        $windowId              = $('#windowId');                //用户ID

        //获取用户信息
        $.get('/api/h5/user/getUserinfo',function (res) {
            $windowMainHeaderImage.attr('src',res.user.avatar);
            $windowUsername.text(res.user.user_nicename);
            $windowId.text(res.user.id);
        })
    },
    bindEvent : function () {
        var $windowWrap       = $('#windowWrap');
        var $windowCollection = $('#windowCollection');
        var $windowClose      = $('#windowClose');
        var $windowRefresh    = $('#windowRefresh');
        var $float            = $('#float');
        //收藏

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
    loadPackage : function () {

    }
}
$(function () {
    page.init();
})