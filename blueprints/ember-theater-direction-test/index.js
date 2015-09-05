var Blueprint = require('ember-cli/lib/models/blueprint');
var componentBlueprint = Blueprint.lookup('component-test');

module.exports = {
  description: 'Generates a test for an ember-theater direction',

  beforeInstall: function(options) {
    return componentBlueprint.install(options);
  },

  beforeUninstall: function(options) {
    return componentBlueprint.uninstall(options);
  }
};
