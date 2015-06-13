/* jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

module.exports = {
  name: 'ember-theater',

  treeForVendor: function(tree){
    var velocityPath = path.dirname(require.resolve('velocity-animate'));
    var velocityTree = pickFiles(this.treeGenerator(velocityPath), {
      srcDir: '/',
        destDir: 'velocity-animate'
    });
    return mergeTrees([tree, velocityTree]);
  },

  included: function(app) {
    this._super.included(app);
    app.import('vendor/velocity-animate/velocity.js');
    app.import('vendor/velocity-animate/velocity.ui.js');
  }
};
