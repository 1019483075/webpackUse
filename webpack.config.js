var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");//从js中吧css抽离出来
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//css压缩
//
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
//

var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
var getHtmlConfig = function (name, title) {
  return {
    template: './src/view/' + name + '.html',//模板的来源
    filename: 'view/' + name + '.html',//生成模板的名字
    title: title,
    inject: true,
    hash: true
  }
}
var config = {
  entry: {
    'login': './src/pages/login/login.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),//编译目录不能用于html中的js
    publicPath: WEBPACK_ENV == 'dev' ? '/' : "../",//需要理解WEBPACK_ENV == 'dev' ? '/' : "../"   虚拟目录指向编译目录  在html中引入js加入虚拟目录
    filename: 'js/[name].js',
    
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.less|css$/,
        loaders: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader'])//必须按这个顺序css-loader','postcss-loader','less-loader从右往左执行
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name:'font/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    // inline: true,
    // progress: true,
    noInfo: true,
    overlay: true
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({//生产通用模块
    //   name: 'common',
    //   filename: 'js/base.js'
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap:false,
    //   parallel: true
    // }),
    new ExtractTextPlugin("css/[name].css"),//抽离
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    
    new HtmlWebpackPlugin(getHtmlConfig('login', '登录')),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]
}
// if('dev'===WEBPACK_ENV){
// config.entry.common.push('webpack-dev-server/client?http://localhost:8088/')
// }
module.exports = config
