const { resolve } = require('path')
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const devConfig = {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash].js',
    path: resolve(__dirname, '../dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    hot: true,
  },
  cache: {
    // 持久化缓存
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // 更好的显示开发报错信息
    new FriendlyErrorsWebpackPlugin()
  ],
};

module.exports = merge(commonConfig, devConfig);
