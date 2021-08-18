const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000, //是把小于1k的文件打成Base64的格式，写入JS
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [new HtmlWebpackPlugin()],
};
