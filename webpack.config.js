var path = require('path');

module.exports = {
  entry: './lib/app.js',
  output: {
    path: path.join(__dirname, 'lib/public/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
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
