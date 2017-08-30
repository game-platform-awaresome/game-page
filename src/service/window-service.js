var _tool = require('util/tool.js');


var _window = {
    //获取用户信息
    getUserInfo : function(resolve,reject){
        _tool.request({
            url : '/api/h5/user/getUserinfo',
            success : resolve,
            error : reject
        })
    }
}

module.exports = _window;