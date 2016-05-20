/* jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

function getParentApp(app) {
  if (typeof app.import !== 'function' && app.app) {
    return getParentApp(app.app);
  } else {
    return app;
  }
}

module.exports = {
  name: 'ember-theater',

  // treeForVendor: function(){
  //   var _this = this;
  //
  //   var treeify = function treeify(name) {
  //     var treePath = path.dirname(require.resolve(name));
  //     return pickFiles(_this.treeGenerator(treePath), {
  //       srcDir: '/',
  //       destDir: name
  //     });
  //   }
  //
  //   return mergeTrees([
  //     treeify('velocity-animate')
  //   ]);
  // },
  //
  // included: function(app) {
  //   this._super.included(app);
  //
  //   app = getParentApp(app);
  //
  //   app.import('vendor/velocity-animate/velocity.js');
  //   app.import('vendor/velocity-animate/velocity.ui.js');
  // }
};
