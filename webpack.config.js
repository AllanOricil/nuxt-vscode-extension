const WebpackObfuscator = require("webpack-obfuscator");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const config = {
  target: "node",
  entry: "./src/extension.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  externals: {
    vscode: "commonjs vscode",
    request: "commonjs request",
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new WebpackObfuscator(
      {
        compact: true,
        identifierNamesGenerator: "mangled",
        selfDefending: true,
        stringArray: true,
        rotateStringArray: true,
        shuffleStringArray: true,
        stringArrayThreshold: 0.8,
      },
      []
    ),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
module.exports = config;
