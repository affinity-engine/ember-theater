/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var addon = new EmberAddon({
    babel: {
      includePolyfill: true,
      stage: 1
    },

    sassOptions: {
      extensions: 'scss'
    },

    'ember-cli-qunit': {
      useLintTree: false
    }
  });

  return addon.toTree();
}
