const vscode = require("vscode");
const handlers = require("./handlers");
const { isNuxtProject } = require("../../nuxt");

const activate = (context) => {
  vscode.workspace.getConfiguration('nuxt').update('isNuxtApp', isNuxtProject());
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createApp", handlers.onCreateApp))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.startDevServer", handlers.onStartDevServer))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.openApp", handlers.onOpenApp))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.setPortNumber", handlers.onSetPortNumber))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.ceateStandardDirectories", handlers.onCreateStandardDirectories))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createPage", handlers.onCreatePage))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createComponent", handlers.onCreateComponent))
  context.subscriptions.push(vscode.commands.registerCommand("Nuxt.createStore", handlers.onCreateStore))
};

const deactivate = () => {
};

module.exports = {
  activate,
  deactivate,
};
