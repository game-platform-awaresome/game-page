var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');



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
        'common' : './src/page/common/index.js',
        'index' : './src/page/index/index.js'
    },
    output : {
        path : './dist/',
        filename : 'js/[name].js'
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    module : {
        loaders : [
            {test : /\.css$/,loader : ExtractTextPlugin.extract('style-loader','css-loader')}
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


module.exports = config;