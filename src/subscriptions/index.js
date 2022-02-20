const buttons = require("./buttons");
const commands = require("./commands");

const activate = (context) => {
  buttons.activate(context);
  commands.activate(context);
};

const deactivate = () => {
  buttons.deactivate();
  commands.deactivate();
};

module.exports = {
  activate,
  deactivate,
};
