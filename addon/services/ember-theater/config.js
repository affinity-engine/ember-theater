import Ember from 'ember';
import config from 'ember-get-config';
import defaultConfig from 'ember-theater/ember-theater/default-config';

const {
  Service,
  merge,
  on,
  setProperties
} = Ember;

export default Service.extend({
  generateConfig: on('init', function() {
    const appConfig = requirejs(`${config.modulePrefix}\/ember-theater\/config`).default;
    const mergedConfig = Ember.$.extend(true, {}, defaultConfig, appConfig);

    setProperties(this, mergedConfig);
  })
});
