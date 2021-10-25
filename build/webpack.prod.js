const path = require('path');
// 合并配置文件
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
// 提取css单独一个文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 优化和压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 优化减少js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    environment: {
      arrowFunction: false,
      destructuring: false,
    },
    clean: true,
  },
  optimization: {
    //  在编译时每当有错误时，就会 emit asset
    emitOnErrors: true,
    // 分离chunks
    splitChunks: {
      // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          // 只打包初始时依赖的第三方
          chunks: 'initial',
        },
      },
    },
    // 是否压缩
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_debugger: true,
            // drop_console: true,
          },
        },
        // 开启缓存
        cache: true,
        // 允许并发
        parallel: true,
        // set to true if you want JS source maps
        sourceMap: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   // you can specify a publicPath here
            //   // by default it use publicPath in webpackOptions.output
            //   publicPath: '../',
            // },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
