const vscode = require("vscode");
const { isPortNumberValid, isAppNameValid } = require("../../validators");
const tcpPortUsed = require("tcp-port-used");
const i18n = require("i18n");
const { getButton } = require("../buttons");
const {
  startDevServerCommand,
  getAppUrl,
  getAppPortNumber,
  workspaceConfiguration
} = require("../../nuxt");
const constants = require("../../constants");
const isValidPath = require("is-valid-path");
const path = require('path');

const onStartDevServer = () => {
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

const onOpenApp = () => {
  vscode.env.openExternal(getAppUrl());
};

const onSetPortNumber = () => {
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
              workspaceConfiguration
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

const onCreateApp = () => {
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

const onCreateStandardDirectories = () => {
  Promise.all(
    constants.NUXT_DIRECTORIES.map((directory) => {
      vscode.workspace.fs.createDirectory(
        vscode.Uri.joinPath(constants.NUXT_PROJECT_URI, directory)
      )
    })
  )
  .catch(() => {
    vscode.window.showErrorMessage(
      i18n.__("errors.couldNotCreateStandardDirectories")
    );
  });
}

const createComponent = (parentDirectory, inputPrompt, inputPlaceHolder) => {
  vscode.window
    .showInputBox({
      prompt: inputPrompt,
      placeHolder: inputPlaceHolder,
    })
    .then((newComponentPath) => {
      if(isValidPath(newComponentPath)){
        if(path.extname(newComponentPath) === '.vue'){
          const componentPath = vscode.Uri.joinPath(constants.NUXT_PROJECT_URI, parentDirectory, newComponentPath);
          vscode.workspace.fs.writeFile(
            componentPath, 
            Buffer.from(constants.VUE_COMPONENT_SNIPPET, 'utf-8')
          )
          .then(() => {
            vscode.workspace.openTextDocument(componentPath)
            .then((componentDoc) => {
              vscode.window.showTextDocument(componentDoc);
            });
          })
          .catch(() => {
            vscode.window.showErrorMessage(i18n.__("errors.couldNotCreateComponent"));
          })
        }else{
          vscode.window.showErrorMessage(i18n.__("errors.wrongExtension"));
        }
      }else{
        vscode.window.showErrorMessage(i18n.__("errors.invalidPath").replace('{0}', inputPlaceHolder));
      }
    })
}

const onCreatePage = () => {
  createComponent('pages',  i18n.__("inputBoxes.createPage.prompt"), i18n.__("inputBoxes.createPage.placeHolder"));
}

const onCreateComponent = () => {
  createComponent('components',  i18n.__("inputBoxes.createComponent.prompt"), i18n.__("inputBoxes.createComponent.placeHolder"));
}

module.exports = {
  onStartDevServer,
  onOpenApp,
  onSetPortNumber,
  onCreateApp,
  onCreatePage,
  onCreateComponent,
  onCreateStandardDirectories
};
