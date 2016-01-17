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

    eslint: {
      testGenerator: eslintTestGenerator
    },
    codemirror: {
      modes: ['javascript']
    }
  });

  /* eslintTestGenerator */
  function render(errors) {
    if (!errors) { return ''; }
    return errors.map(function(error) {
      return error.line + ':' + error.column + ' ' +
        ' - ' + error.message + ' (' + error.ruleId +')';
    }).join('\n');
  }

  // Qunit test generator
  function eslintTestGenerator(relativePath, errors) {
    var pass = !errors || errors.length === 0;
    return "import { module, test } from 'qunit';\n" +
      "module('ESLint - " + path.dirname(relativePath) + "');\n" +
      "test('" + relativePath + " should pass ESLint', function(assert) {\n" +
      "  assert.ok(" + pass + ", '" + relativePath + " should pass ESLint." +
      jsStringEscape("\n" + render(errors)) + "');\n" +
      "});\n";
  }

  return addon.toTree();
}
