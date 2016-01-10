/* jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

module.exports = {
  name: 'ember-theater',

  treeForVendor: function(){
    var _this = this;

    var treeify = function treeify(name) {
      var treePath = path.dirname(require.resolve(name));
      return pickFiles(_this.treeGenerator(treePath), {
        srcDir: '/',
        destDir: name
      });
    }

    return mergeTrees([
      treeify('perfect-scrollbar'),
      treeify('velocity-animate'),
      treeify('babel-standalone')
    ]);
  },

  included: function(app) {
    this._super.included(app);
    app.import(path.join(app.bowerDirectory, 'lokijs/src/lokijs.js'));
    app.import(path.join(app.bowerDirectory, 'PreloadJS/lib/preloadjs-NEXT.combined.js'));
    app.import(path.join(app.bowerDirectory, 'SoundJS/lib/soundjs-NEXT.combined.js'));
    app.import(path.join(app.bowerDirectory, 'progressbar.js/dist/progressbar.min.js'));
    app.import('vendor/perfect-scrollbar/dist/js/min/perfect-scrollbar.min.js');
    app.import('vendor/perfect-scrollbar/dist/css/perfect-scrollbar.min.css');
    app.import('vendor/velocity-animate/velocity.js');
    app.import('vendor/velocity-animate/velocity.ui.js');
    app.import('vendor/babel-standalone/babel.js');
  }
};
