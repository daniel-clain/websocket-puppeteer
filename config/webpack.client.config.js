const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './source-code/client/client.tsx',
  output:{
    path: path.resolve(__dirname, './../compiled-code/client/'),
    filename: "client.js"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
            configFileName: 'config/tsconfig.json'
        },
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source-code/client/index.html'
    })
  ],
  performance: {
    hints: false
  }
};