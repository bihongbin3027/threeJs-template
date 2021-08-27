const { merge } = require('webpack-merge');
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
  plugins: [],
};

module.exports = merge(commonConfig, prodConfig);
