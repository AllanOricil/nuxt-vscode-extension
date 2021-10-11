// @ts-nocheck
const vscode = require("vscode");
const nuxt = require("./main");
const path = require("path");
const i18n = require("i18n");
const supportedLocales = ["en", "fr", "pt-br"];

const activate = async (context) => {
  console.log(path.join(context.extensionPath, "assets", "locales"));

  i18n.configure({
    locales: supportedLocales,
    directory: path.join(context.extensionPath, "assets", "locales"),
    defaultLocale: supportedLocales.includes(vscode.env.language)
      ? vscode.env.language
      : "en",
  });

  await nuxt.activate(context);
  vscode.window.showInformationMessage(
    i18n.__("informationMessages.nuxtExtensionIsReady")
  );
};

const deactivate = () => {
  nuxt.deactivate();
};

module.exports = {
  activate,
  deactivate,
};
