/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      includePolyfill: true,
      stage: 1
    },
    sassOptions: {
      extensions: 'scss'
    }
  });

  return app.toTree();
}
