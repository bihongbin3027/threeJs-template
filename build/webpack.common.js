const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/dist/index");

module.exports = {
  entry: {
    bundle: "./src/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|gltf|ttf|woff|woff2|obj|mtl|fbx)$/,
        use: {
          loader: "url-loader",
          options: {
            // 把小于10k的文件打成Base64的格式，写入JS
            limit: 10240,
            // false 使用common.js
            esModule: false,
            // 超过10k输出的文件目录
            outputPath: "assets",
            // 超过10k的文件名称
            name: "[name]_[hash:0].[ext]",
          },
        },
      },
    ],
  },
  resolve: {
    // 引入文件可以不写后缀
    extensions: [".js", ".vue", ".ts", ".tsx"],
    // 别名
    alias: {
      "@": resolve("src"),
    },
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    // index.html
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
    }),
    // 处理静态文件夹 static 复制到打包的 static 文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, "../static"),
          to: "static",
        },
      ],
    }),
    // 在单独的进程上运行TypeScript类型检查器的Webpack插件
    new ForkTsCheckerWebpackPlugin(),
  ],
};
