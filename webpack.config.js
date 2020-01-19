'use strict';

const TerserPlugin = require('terser-webpack-plugin');

const paths = require('./paths');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexTs,
  },

  output: {
    path: paths.build,
    filename: 'linter.js',
  },

  watch: false,

  devtool: false,

  optimization: {
    noEmitOnErrors: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  resolve: {
    extensions: ['.ts'],
    modules: [
      'node_modules',
    ],
    alias: {
      src: paths.src,
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
