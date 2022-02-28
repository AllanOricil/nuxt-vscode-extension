const subscriptions = require("./subscriptions");
const i18n = require("./i18n");
const { disposeTerminals } = require("./nuxt");

const activate = async (context) => {
    disposeTerminals();
    i18n.configure(context);
    subscriptions.activate(context);
};

const deactivate = () => {
  disposeTerminals();
  subscriptions.deactivate();
};

module.exports = {
  activate,
  deactivate,
};
