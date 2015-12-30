var path = require('path');

module.exports = {
  entry: './src/app/app.js',
  output: {
    path: path.join(__dirname, 'public/js'),
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
    contentBase: "./public/js",
    noInfo: true,
    hot: true,
    inline: true
  }
};
