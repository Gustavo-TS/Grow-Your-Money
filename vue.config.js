const path = require('path');

module.exports = {
    transpileDependencies: ['chart.js'],
  devServer: {
    port: 3000
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
};

