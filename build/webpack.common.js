const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
