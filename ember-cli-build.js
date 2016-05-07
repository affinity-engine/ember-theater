/* global require, module */

var path = require('path');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var jsStringEscape = require('js-string-escape');

module.exports = function(defaults) {
  var addon = new EmberAddon(defaults, {
    babel: {
      includePolyfill: true,
      stage: 1
    },

    sassOptions: {
      extensions: 'scss'
    },

    'ember-cli-qunit': {
      useLintTree: false
    },

    codemirror: {
      modes: ['javascript']
    }
  });

  return addon.toTree();
}
