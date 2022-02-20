const subscriptions = require("./subscriptions");
const i18n = require("./i18n");
const { isNuxtProject } = require("./nuxt");

const activate = async (context) => {
  if (isNuxtProject()) {
    i18n.configure(context);
    subscriptions.activate(context);
  }
};

const deactivate = () => {
  subscriptions.deactivate();
};

module.exports = {
  activate,
  deactivate,
};
