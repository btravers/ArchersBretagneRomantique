var path = require('path');

module.exports = {
  entry: './lib/app.js',
  output: {
    path: path.join(__dirname, 'lib/public/js/bundle.js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  },
  devServer: {
    contentBase: "./lib/public",
    noInfo: true,
    hot: true,
    inline: true
  }
};
