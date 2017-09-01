var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

//环境变量配置    dev  /  online
var WEBPACK_ENV  =  process.env.WEBPACK_ENV  ||  'dev'
console.log(WEBPACK_ENV)


//获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name) {
    return {
        template : './src/view/' + name + '.html',
        filename : 'view/' + name + '.html',
        inject : true,
        hash : true,
        chunks : ['common',name]
    }
}

var config = {
    entry : {
        'common' : ['./src/page/common/index.js'],
        'index' : './src/page/index/index.js'
    },
    output : {
        path : './dist/',
        publicPath:'/play/',
        filename : 'js/[name].js'
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    resolve :{
        alias : {
            util         : __dirname + '/src/util',
            page         : __dirname + '/src/page',
            service      : __dirname + '/src/service',
            image        : __dirname + '/src/image',
            node_modules : __dirname + '/node_modules',
            view         : __dirname + '/src/view'
        }
    },
    module : {
        loaders : [
            {test : /\.css$/,loader : ExtractTextPlugin.extract('style-loader','css-loader')},
            {test:/\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,loader:'url-loader?limit=1000&name=resource/[name].[ext]'},
            {test:/\.string$/,loader:'html-loader'}
        ]
    },
    plugins : [
        //独立通用模块
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        //把CSS单独打包到文件里
        new ExtractTextPlugin('css/[name].css'),
        //HTML模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index'))
    ]
}
//做判断
if(WEBPACK_ENV === 'dev'){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/')
}

module.exports = config;