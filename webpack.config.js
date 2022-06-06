// 套件引入
const path = require('path');
const webpack  = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');



module.exports = {
  entry: {
    index: './src/index.js'
  },               // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },             // 出口文件
  module: {
        rules: [{
            // 格式
            test: /\.(sass|scss|css)$/,
            //順序是由下到上 css > style
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      publicPath: './dist'
                    }
                  },
                // 'style-loader',//跟MiniCssExtractPlugin 會衝突所以要關掉
                'css-loader',
                'sass-loader'
            ],
        },
        //babel loader
        {
            test: /\.(js)$/,
            exclude: /(node_modules)/,

            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }],
            include: path.resolve(__dirname, 'src'),
        },

      ]

    },          // 處裡對應模組
  resolve: {
        alias: {
           vue: 'vue/dist/vue.js'
        }
      },  // 解決 vue 路徑問題
  plugins: [
    new CleanWebpackPlugin(), // 清除舊檔案
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    }), //產生css檔案
    new HtmlWebpackPlugin({
      chunks: ['index'],  //選擇注入資源 chunk
      inject: 'body', //預設<body> js </body>  head or body
      template: './src/index.html',
      //來源
      filename: 'index.html'
      // 目的地
    }), // html 打包
    new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          }) // 全域使用 jquery
  ], // 對應的插件
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 3300,
    // 指定首頁檔案
    index: 'index.html',
    open: true
  },         // 服務器配置
  mode: 'development'      // 開發模式配置   //上線用 production
}