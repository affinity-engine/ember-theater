var Blueprint = require('ember-cli/lib/models/blueprint');
var blueprints = ['component', 'component-addon'].map(function(name) {
  return Blueprint.lookup(name);
});

module.exports = {
  description: 'Generates a direction for ember-theater.',

  beforeInstall: function(options) {
    options.entity.name = 'ember-theater/directable/' + options.entity.name;
    blueprints.forEach(function(blueprint) {
      blueprint.install(options);
    });
  },

  beforeUninstall: function(options) {
    options.entity.name = 'ember-theater/directable/' + options.entity.name;
    blueprints.forEach(function(blueprint) {
      blueprint.uninstall(options);
    });
  }
};
