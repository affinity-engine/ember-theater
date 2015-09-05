var EOL = require('os').EOL;

module.exports = {
  description: 'Generates files for ember theater',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var _this = this;
    var packages = [{
      name: 'lokijs',
      target: '~1.3.9'
    }]; 
    
    return this.addBowerPackagesToProject(packages).then(function() {
      return _this.addAddonToProject({ name: 'ember-intl', target: '2.0.0-beta.22' });
    }).then(function() {
      return _this.addAddonToProject({ name: 'ember-keyboard-service', target: '0.3.0' });
    }).then(function() {
      return _this.insertIntoFile('ember-cli-build.js',
        '    babel: { includePolyfill: true, stage: 2 }',
        { after: 'var app = new EmberApp(defaults, {' + EOL });
    });
  }
};
