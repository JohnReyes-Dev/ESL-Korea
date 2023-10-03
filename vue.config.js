const path = require('path');

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  
  // devServer: {
  //   port: 80
  // },
  outputDir: path.resolve(__dirname, 'server/dist'),
};
