'use strict';
var Hogan = require('hogan');

var tools = {
    //网络请求
    request : function (param) {
        var _this = this;
        $.ajax({
            type        : param.method  || 'get',
            url         : param.url     || '',
            dataType    : param.type    || 'json',
            data        : param.data    || '',
            success     : function (res) {
                //请求成功
                if(2000 == res.code){
                    typeof  param === 'function' && param.success(res);
                }
                //没有登录状态
                else if(4006 == res.code){
                    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href)
                }
                //请求失败
                else{
                    typeof param.error === 'function' && param.error(res);
                }
            },
            error       : function (err) {
                console.log(err);
            }
        })
    },
    //获取url参数
    getUrlParam : function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null
    },
    //渲染html模板
    renderHtml : function(htmlTemplate,data){
        var template    = Hogan.compile(htmlTemplate),
            result      = template.render(data);
        return result;
    },
    //成功提示
    successTips : function(msg){
        alert(msg || '操作成功');
    },
    //错误提示
    errorTips : function(msg){
        alert(msg || '哪里不对了吧');
    },
    //转换成数组
    transformArray :  function(obj){
        var arr = [];
        for(var item in obj){
            arr.push(obj[item]);
        }
        return arr;
    },
    //判断是否是微信浏览器
    isWechat : function() {
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            console.log('是微信浏览器')
            return true;
        }else{
            console.log('不是微信浏览器')
            return false;
        }
    }
}

module.exports = tools;