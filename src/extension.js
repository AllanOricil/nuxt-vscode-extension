const subscriptions = require("./subscriptions");
const i18n = require("./i18n");
const { isNuxtProject, disposeTerminals } = require("./nuxt");

const activate = async (context) => {
  if (isNuxtProject()) {
    disposeTerminals();
    i18n.configure(context);
    subscriptions.activate(context);
  }
};

const deactivate = () => {
  disposeTerminals();
  subscriptions.deactivate();
};

module.exports = {
  activate,
  deactivate,
};
