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
            // 把小于10k的文件打成Base64的格式，写入JS
            limit: 10240,
            esModule: false,
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
  // webpack的性能提示
  performance: {
    // 开发环境不启用，生成环境启用
    hints: process.env.NODE_ENV === 'development' ? false : 'warning',
  },
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
