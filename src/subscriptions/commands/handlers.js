const vscode = require("vscode");
const { isPortNumberValid, isAppNameValid } = require("../../validators");
const tcpPortUsed = require("tcp-port-used");
const i18n = require("i18n");
const { getButton } = require("../buttons");
const {
  startDevServerCommand,
  getAppUrl,
  getAppPortNumber,
  getWorkspaceConfiguration,
} = require("../../nuxt");

const onClickStartDevServer = () => {
  const startDevServerButton = getButton("Nuxt.startDevServer");
  const openAppButton = getButton("Nuxt.openApp");

  const terminal = vscode.window.createTerminal({
    name: "Nuxt",
  });
  terminal.show();

  const appPortNumber = getAppPortNumber();
  if (process.platform === "win32")
    terminal.sendText(`$env:PORT=${appPortNumber}`, true);
  else terminal.sendText(`export PORT=${appPortNumber}`, true);
  terminal.sendText(startDevServerCommand(), true);

  vscode.env.openExternal(getAppUrl());

  vscode.window.onDidCloseTerminal((t) => {
    if (t.name === "Nuxt") {
      startDevServerButton.show();
      openAppButton.hide();
    }
  });

  startDevServerButton.hide();
  openAppButton.show();
};

const onClickOpenApp = () => {
  vscode.env.openExternal(getAppUrl());
};

const onClickSetPortNumber = () => {
  const setPortNumberButton = getButton("Nuxt.setPortNumber");
  vscode.window
    .showInputBox({
      prompt: i18n.__("inputBoxes.setPortNumber.prompt"),
      placeHolder: i18n.__("inputBoxes.setPortNumber.placeHolder"),
    })
    .then((portNumber) => {
      if (portNumber && isPortNumberValid(portNumber)) {
        tcpPortUsed.check(parseInt(portNumber)).then(
          (inUse) => {
            if (!inUse) {
              getWorkspaceConfiguration()
                .update("portNumber", parseInt(portNumber))
                .then(() => {
                  setPortNumberButton.text = `$(ports-open-browser-icon) ${portNumber}`;
                });
            } else {
              vscode.window.showErrorMessage(
                i18n.__("errors.portNumberIsNotAvailable")
              );
            }
          },
          (err) => {
            console.error(
              "ERROR: Could not verify if TCP Port is in use",
              err.message
            );
          }
        );
      } else {
        vscode.window.showErrorMessage(i18n.__("errors.portNumberIsNotValid"));
      }
    });
};

const onClickCreateApp = () => {
  vscode.window
    .showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: i18n.__("openDialogs.createApp.selectDirectory.openLabel"),
      title: i18n.__("openDialogs.createApp.selectDirectory.title"),
    })
    .then((directories) => {
      if (directories) {
        const chosenDirectory = directories[0];
        vscode.window
          .showInputBox({
            prompt: i18n.__("inputBoxes.createApp.prompt"),
            placeHolder: i18n.__("inputBoxes.createApp.placeHolder"),
          })
          .then((appName) => {
            if (appName && isAppNameValid(appName)) {
              const terminal = vscode.window.createTerminal({
                name: "Nuxt",
                cwd: chosenDirectory,
              });
              terminal.show();
              terminal.sendText(`npx create-nuxt-app ${appName}`, true);
            } else {
              vscode.window.showErrorMessage(
                i18n.__("errors.appNameIsNotValid")
              );
            }
          });
      }
    });
};

module.exports = {
  onClickStartDevServer,
  onClickOpenApp,
  onClickSetPortNumber,
  onClickCreateApp,
};
