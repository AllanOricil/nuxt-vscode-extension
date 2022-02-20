const vscode = require("vscode");
const i18n = require("i18n");
const { getAppPortNumber } = require("../../nuxt");

const BUTTONS_START_INDEX = 150;
const buttons = {};

const createButton = (command, text, tooltip, alignment, index) => {
  button = vscode.window.createStatusBarItem(alignment, index);
  button.command = command;
  button.text = text;
  button.tooltip = tooltip;
  buttons[command] = button;
  return button;
};

const getButton = (command) => {
  return buttons[command];
};

const activate = (context) => {
  context.subscriptions.push(
    createButton(
      "Nuxt.startDevServer",
      `$(notebook-execute) ${i18n.__("statusBarButtons.startDevServer.text")}`,
      i18n.__("statusBarButtons.startDevServer.tooltip"),
      vscode.StatusBarAlignment.Left,
      BUTTONS_START_INDEX
    )
  );

  context.subscriptions.push(
    createButton(
      "Nuxt.openApp",
      `$(default-view-icon) ${i18n.__("statusBarButtons.openApp.text")}`,
      i18n.__("statusBarButtons.openApp.tooltip"),
      vscode.StatusBarAlignment.Left,
      BUTTONS_START_INDEX
    )
  );

  context.subscriptions.push(
    createButton(
      "Nuxt.setPortNumber",
      `$(ports-open-browser-icon) ${getAppPortNumber()}`,
      i18n.__("statusBarButtons.setPortNumber.tooltip"),
      vscode.StatusBarAlignment.Left,
      BUTTONS_START_INDEX - 1
    )
  );

  buttons["Nuxt.startDevServer"].show();
  buttons["Nuxt.setPortNumber"].show();
};

const deactivate = () => {
  startDevServerButton.dispose();
  openAppButton.dispose();
  setPortNumberButton.dispose();
};

module.exports = {
  getButton,
  activate,
  deactivate,
};
