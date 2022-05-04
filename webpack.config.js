const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'game.js',
    path: path.join(__dirname, 'public')
  },
};
