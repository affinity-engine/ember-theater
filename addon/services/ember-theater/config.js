import Ember from 'ember';
import config from 'ember-get-config';
import defaultConfig from 'ember-theater/ember-theater/default-config';

const {
  Service,
  on,
  setProperties
} = Ember;

export default Service.extend({
  generateConfig: on('init', function() {
    const appConfig = requirejs(`${config.modulePrefix}\/ember-theater\/config`).default;

    setProperties(this, defaultConfig);
    setProperties(this, appConfig);
  })
});
