const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 必须定义resolve
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  entry: {
    bundle: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|gltf|ttf|woff|woff2|obj|mtl)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 把小于10k的文件打成Base64的格式，写入JS
            limit: 10240,
            // false 使用common.js
            esModule: false,
            // 超过10k输出的文件目录
            outputPath: 'assets',
            // 超过10k的文件名称
            name: '[name]_[hash:0].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [new HtmlWebpackPlugin()],
};
