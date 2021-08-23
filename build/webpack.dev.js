const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    open: true,
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = merge(commonConfig, devConfig);
