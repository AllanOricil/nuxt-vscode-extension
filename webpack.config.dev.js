const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const config = {
  target: "node",
  entry: "./src/extension.js",
  mode: "development",
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
  devtool: "source-map",
  resolve: {
    extensions: [".js"],
  },
  plugins: [new CleanWebpackPlugin(), new Dotenv()],
};
module.exports = config;
