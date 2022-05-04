const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'game.js',
    path: path.join(__dirname, 'public')
  },
  devServer: {
    // static: {
    //   directory: path.join(__dirname, 'public'),
    //   watch: true
    // },
    // hot: true,
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 8888,
  },
  devtool: 'source-map',
};
