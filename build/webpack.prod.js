const { merge } = require('webpack-merge');
// 打包前清空文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// js压缩
const TerserPlugin = require('terser-webpack-plugin');
// 提取css单独一个文件
const MiniCssExtractplugin = require('mini-css-extract-plugin');
// 优化和压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production',
  // webpack的性能提示
  performance: {
    // 生产环境启用
    hints: 'warning',
    // 以字节为单位, 默认为 250k
    maxEntrypointSize: 50000,
    // 以字节单位
    maxAssetSize: 450000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractplugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractplugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CssMinimizerPlugin(),
  ],
};

module.exports = merge(commonConfig, prodConfig);
