const vscode = require("vscode");
const path = require("path");
const i18n = require("i18n");
const supportedLocales = ["en", "fr", "pt-br"];

const configure = (context) => {
  const defaultLocale = supportedLocales.includes(vscode.env.language)
    ? vscode.env.language
    : "en";
  i18n.configure({
    locales: supportedLocales,
    directory: path.join(context.extensionPath, "assets", "locales"),
    defaultLocale,
  });
};

module.exports = {
  configure,
};
