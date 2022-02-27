const vscode = require("vscode");
const fs = require("fs");
const hasYarn = require("has-yarn");
const constants = require("../constants");
const i18n = require("i18n");

const isNuxtProject = () => {
  return fs.existsSync(constants.NUXT_CONFIG_URI.fsPath);
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

const workspaceConfiguration = vscode.workspace.getConfiguration("nuxt");

const getAppPortNumber = () => {
  return workspaceConfiguration.get("portNumber") || constants.NUXT_DEFAULT_PORT_NUMBER;
};

module.exports = {
  startDevServerCommand,
  getAppUrl,
  getAppPortNumber,
  workspaceConfiguration,
  isNuxtProject,
  disposeTerminals
};
