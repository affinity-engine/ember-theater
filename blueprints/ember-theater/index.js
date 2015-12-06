var EOL = require('os').EOL;

module.exports = {
  description: 'Generates files for ember theater',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var _this = this;
    var packages = [{
      name: 'lokijs',
      target: '~1.3.9'
    }, {
      name: 'PreloadJS',
      target: '0.6.1'
    }, {
      name: 'SoundJS',
      target: '0.6.1'
    }, {
      name: 'progressbar.js',
      target: '~0.9.0'
    }]; 
    
    return this.addBowerPackagesToProject(packages).then(function() {
      return _this.addAddonToProject({ name: 'ember-intl', target: '2.0.0-beta.22' });
    }).then(function() {
      return _this.addAddonToProject({ name: 'ember-inflector', target: '1.9.3' });
    }).then(function() {
      return _this.addAddonToProject({ name: 'ember-keyboard', target: '0.0.7' });
    }).then(function() {
      return _this.addAddonToProject({ name: 'ember-cli-font-awesome', target: '1.4.0-beta.1' });
    }).then(function() {
      return _this.insertIntoFile('ember-cli-build.js',
        '    babel: { includePolyfill: true, stage: 2 },',
        { after: 'var app = new EmberApp(defaults, {' + EOL });
    });
  }
};
