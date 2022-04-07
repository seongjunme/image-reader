const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  name: 'image-reader',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_module/,
        use: 'ts-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]?[hash]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@typings': path.resolve(__dirname, 'src/typings'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: true,
    }),
    isDevelopment
      ? new MiniCssExtractPlugin({
          filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
          chunkFilename: isDevelopment
            ? '[name].css'
            : '[id].[contenthash].css',
        })
      : null,
  ],
};
