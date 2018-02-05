var webpack = require("webpack");
var path = require("path");

module.exports = {

  devtool : "source-map",

  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:3002/",
      "webpack/hot/only-dev-server",
      "./src/main.ts",
    ],
    vendor: [
      "react",
      "redux",
      "react-redux",
      "react-dom"
    ]
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath : "/dist/"
  },

  resolve : {
    extensions : ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"]
  },

  module : {
    loaders : [
      { test: /\.ts(x?)$/, loaders : ["react-hot", "ts"], include : path.join(__dirname, "src") }
    ],

    noParse: /node_modules\/json-schema\/lib\/validate\.js/
  },

  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin( "vendor", "vendor.bundle.js" )
  ],

  externals: {
    fs: "{}",
    tls: "{}",
    net: "{}",
    console: true
  },

  modulesDirectories: [
    "node_modules"
  ]
};
