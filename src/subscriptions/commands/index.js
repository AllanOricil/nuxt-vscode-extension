const vscode = require("vscode");
const {
  onClickStartDevServer,
  onClickOpenApp,
  onClickSetPortNumber,
  onClickCreateApp,
} = require("./handlers");
const nuxt = require("../../nuxt");

const registerCommand = (context, command, handler) => {
  context.subscriptions.push(vscode.commands.registerCommand(command, handler));
};

const activate = (context) => {
  nuxt.disposeTerminals();
  registerCommand(context, "Nuxt.startDevServer", onClickStartDevServer);
  registerCommand(context, "Nuxt.openApp", onClickOpenApp);
  registerCommand(context, "Nuxt.setPortNumber", onClickSetPortNumber);
  registerCommand(context, "Nuxt.createApp", onClickCreateApp);
};

const deactivate = () => {
  nuxt.disposeTerminals();
};

module.exports = {
  activate,
  deactivate,
};
