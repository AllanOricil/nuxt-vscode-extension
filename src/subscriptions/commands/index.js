const vscode = require("vscode");
const handlers = require("./handlers");

const activate = (context) => {
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.startDevServer", handlers.onStartDevServer))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.openApp", handlers.onOpenApp))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.setPortNumber", handlers.onSetPortNumber))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createApp", handlers.onCreateApp))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.ceateStandardDirectories", handlers.onCreateStandardDirectories))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createPage", handlers.onCreatePage))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createComponent", handlers.onCreateComponent))
};

const deactivate = () => {
};

module.exports = {
  activate,
  deactivate,
};
