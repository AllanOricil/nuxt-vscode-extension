const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const hasYarn = require("has-yarn");

const NUXT_CONFIG_PATH = path.join(
  vscode.workspace.workspaceFolders[0].uri.fsPath,
  "nuxt.config.js"
);

const isNuxtProject = () => {
  return fs.existsSync(NUXT_CONFIG_PATH);
};

const disposeTerminals = () => {
  vscode.window.terminals
    .filter((terminal) => terminal.name === "Nuxt")
    .forEach((terminal) => terminal.dispose());
};

const startDevServerCommand = () => {
  return hasYarn(vscode.workspace.workspaceFolders[0].uri.fsPath)
    ? "yarn dev"
    : "npm run dev";
};

const getAppUrl = () => {
  return vscode.Uri.parse(`http://localhost:${getAppPortNumber()}`);
};

const getWorkspaceConfiguration = () => {
  return vscode.workspace.getConfiguration("nuxt");
};

const getAppPortNumber = () => {
  return getWorkspaceConfiguration().get("portNumber") || 3000;
};

module.exports = {
  startDevServerCommand,
  getAppUrl,
  getAppPortNumber,
  getWorkspaceConfiguration,
  isNuxtProject,
  disposeTerminals,
};
