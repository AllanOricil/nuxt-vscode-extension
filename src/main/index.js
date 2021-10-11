const vscode = require("vscode");
const hasYarn = require("has-yarn");
const tcpPortUsed = require("tcp-port-used");
const path = require("path");
const fs = require("fs");
const i18n = require("i18n");

//stores the workspace the user is currently working on
const CWD = vscode.workspace.workspaceFolders[0].uri.fsPath;
const NUXT_CONFIG_PATH = path.join(CWD, "nuxt.config.js");

//this will dispose any Nuxt terminals that were opened and not closed before closing vscode
vscode.window.terminals
  .filter((terminal) => terminal.name === "Nuxt")
  .forEach((terminal) => terminal.dispose());
let terminal;

const activate = async (context) => {
  const startDevServerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    136
  );
  startDevServerButton.command = "Nuxt.startDevServer";
  startDevServerButton.text = `$(notebook-execute) ${i18n.__(
    "statusBarButtons.startDevServer.text"
  )}`;
  startDevServerButton.tooltip = i18n.__(
    "statusBarButtons.startDevServer.tooltip"
  );
  context.subscriptions.push(startDevServerButton);

  const openAppButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    136
  );
  openAppButton.command = "Nuxt.openApp";
  openAppButton.text = `$(default-view-icon) ${i18n.__(
    "statusBarButtons.openApp.text"
  )}`;
  openAppButton.tooltip = i18n.__("statusBarButtons.openApp.tooltip");
  context.subscriptions.push(openAppButton);

  const setPortNumberButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    135
  );
  setPortNumberButton.command = "Nuxt.setPortNumber";
  setPortNumberButton.text = `$(ports-open-browser-icon) ${getAppPort()}`;
  setPortNumberButton.tooltip = i18n.__(
    "statusBarButtons.setPortNumber.tooltip"
  );
  context.subscriptions.push(setPortNumberButton);

  //because the activation event is now * it is necessary to check if there is a "nuxt.config.js" in the current working directory before showing these buttons
  if (fs.existsSync(NUXT_CONFIG_PATH)) {
    startDevServerButton.show();
    setPortNumberButton.show();
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("Nuxt.startDevServer", () => {
      startDevServerButton.hide();
      openAppButton.show();

      terminal = vscode.window.createTerminal({
        name: "Nuxt",
      });
      terminal.show();

      switch (process.platform) {
        case "win32":
          terminal.sendText(`$env:PORT=${getAppPort()}`, true);
          break;
        default:
          terminal.sendText(`export PORT=${getAppPort()}`, true);
          break;
      }
      terminal.sendText(getNuxtCommand(), true);

      //small delay to open the browser because it can open before nuxt starts
      //and we also want you to see that a read only terminal has been opened
      setTimeout(() => {
        vscode.env.openExternal(getAppUri());
      }, 2000);

      //we also wait few seconds to let nuxt start before start checking if we should show or hide the "Start Dev" button
      setTimeout(() => {
        //every 1s we check if the App is still running. If it isn't, we show the "Start Dev" button again and hide the "Open App" button
        setInterval(() => {
          tcpPortUsed.check(getAppPort()).then(
            (inUse) => {
              if (!inUse) {
                startDevServerButton.show();
                openAppButton.hide();
              } else {
                startDevServerButton.hide();
                openAppButton.show();
              }
            },
            (err) => {
              console.error("Error on check:", err.message);
            }
          );
        }, 1000);
      }, 10000);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("Nuxt.openApp", () => {
      vscode.env.openExternal(getAppUri());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("Nuxt.setPortNumber", () => {
      vscode.window
        .showInputBox({
          prompt: i18n.__("inputBoxes.setPortNumber.prompt"),
          placeHolder: i18n.__("inputBoxes.setPortNumber.placeHolder"),
        })
        .then((value) => {
          if (value && isPortNumberValid(value)) {
            tcpPortUsed.check(parseInt(value)).then(
              (inUse) => {
                if (!inUse) {
                  getWorkspaceConfiguration()
                    .update("portNumber", parseInt(value))
                    .then(() => {
                      setPortNumberButton.text = `$(ports-open-browser-icon) ${value}`;
                    });
                } else {
                  vscode.window.showErrorMessage(
                    i18n.__("errors.portNumberIsNotAvailable")
                  );
                }
              },
              (err) => {
                console.error("Error on check:", err.message);
              }
            );
          } else {
            vscode.window.showErrorMessage(
              i18n.__("errors.portNumberIsNotValid")
            );
          }
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("Nuxt.createApp", () => {
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
              .then((value) => {
                if (value && isAppNameValid(value)) {
                  terminal = vscode.window.createTerminal({
                    name: "Nuxt",
                    cwd: chosenDirectory,
                  });
                  terminal.show();
                  terminal.sendText(getCreateNuxtAppCommand(value), true);
                } else {
                  vscode.window.showErrorMessage(
                    i18n.__("errors.appNameIsNotValid")
                  );
                }
              });
          }
        });
    })
  );
};

const getWorkspaceConfiguration = () => {
  return vscode.workspace.getConfiguration("nuxt");
};

const getAppPort = () => {
  return getWorkspaceConfiguration().get("portNumber") || 3000;
};

const getNuxtCommand = () => {
  return hasYarn(CWD) ? "yarn dev" : "npm run dev";
};

const getCreateNuxtAppCommand = (appName) => {
  return `npx create-nuxt-app ${appName}`;
};

const getAppUri = () => {
  return vscode.Uri.parse(`http://localhost:${getAppPort()}`);
};

function isPortNumberValid(num) {
  const regexExp =
    /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
  return regexExp.test(num);
}

function isAppNameValid(appName) {
  const regexExp = /^[a-zA-Z0-9_-]*$/gi;
  return regexExp.test(appName);
}

const deactivate = () => {
  terminal.dispose();
};

module.exports = {
  activate,
  deactivate,
};
