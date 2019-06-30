
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  entry: [
    './source-code/server/server.ts'
  ],
  output: {
    path: __dirname + "/compiled-code/server",
    filename: 'server.js'
  },
  devtool: "source-map-loader",
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: [nodeExternals()]
};