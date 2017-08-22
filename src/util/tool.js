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
                if(0 === res.status){
                    typeof  param === 'function' && param.success(res.data,res.msg);
                }
                //没有登录状态

                //请求失败

            },
            error       : function (err) {

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


}

module.exports = tools;