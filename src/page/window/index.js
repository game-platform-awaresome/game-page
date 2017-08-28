require('./index.css');


var page = {
    init : function () {
        this.bindEvent();
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
    }
}
$(function () {
    page.init();
})