import Ember from 'ember';
import config from 'ember-get-config';
import defaultConfig from 'ember-theater/ember-theater/default-config';

const {
  Service,
  get,
  isEmpty,
  on,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  saveStateManager: service('ember-theater/save-state-manager'),

  resetConfig: on('init', function() {
    const appConfig = requirejs(`${config.modulePrefix}\/ember-theater\/config`).default;
    const saveStateManager = get(this, 'saveStateManager');
    const _config = saveStateManager.getStateValue('_config') || {};
    const mergedConfig = Ember.$.extend(true, {}, defaultConfig, appConfig, _config);

    setProperties(this, mergedConfig);
  }),

  getProperty(section, key) {
    return get(this, `${section}.${key}`) || get(this, `globals.${key}`);
  },

  setProperty(key, value) {
    const saveStateManager = get(this, 'saveStateManager');
    const _config = this._getSavedConfig(key);

    set(_config, key, value);
    saveStateManager.setStateValue('_config', _config);

    return set(this, key, value);
  },

  _getSavedConfig(key) {
    const saveStateManager = get(this, 'saveStateManager');
    const _config = get(saveStateManager, '_config') || {};

    const segments = key.split('.');
    
    // ensure full path to the config exists
    segments.forEach((segment, index) => {
      const path = segments.slice(0, index + 1).join('.');

      if (isEmpty(get(_config, path))) {
        set(_config, path, {}); 
      }
    });

    return _config;
  }
});
