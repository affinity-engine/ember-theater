var EOL = require('os').EOL;

module.exports = {
  description: 'Generates files for ember theater',

  afterInstall: function() {
    var packages = [{
      name: 'babel-polyfill',
      target: '~0.0.1'
    }, {
      name: 'lokijs',
      target: '~1.3.9'
    }]; 
    
    this.addBowerPackagesToProject(packages);
    this.addAddonToProject({ name: 'ember-intl', target: '2.0.0-beta.22' });
    this.addAddonToProject({ name: 'ember-keyboard-service', target: '0.3.0' });

    this.insertIntoFile('ember-cli-build.js',
                        'babel: { includePolyfill: true, stage: 2 }',
                        { after: 'var app = new EmberApp(defaults, {' + EOL });
  }
};
