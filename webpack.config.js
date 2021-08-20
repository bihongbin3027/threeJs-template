const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  mode: isDev ? 'development' : 'production',
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
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|gltf|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240, //是把小于10k的文件打成Base64的格式，写入JS
            esModule: false,
            name: '[name]_[hash:0].[ext]',
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
