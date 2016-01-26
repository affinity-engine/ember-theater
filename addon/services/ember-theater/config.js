import Ember from 'ember';
import deepMerge from 'ember-theater/utils/ember-theater/deep-merge';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  computed,
  get,
  isEmpty,
  isPresent,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

const Config = Ember.Object.extend({
  saveStateManagers: service('ember-theater/save-state-manager'),

  saveStateManager: multiService('saveStateManagers'),

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

export default Service.extend(MultiServiceMixin, {
  factory: Config,

  saveStateManagers: service('ember-theater/save-state-manager'),

  resetConfig(theaterConfig) {
    const configs = get(this, '_configs').sort((a, b) => get(a, 'priority') - get(b, 'priority'));
    const mergedConfig = deepMerge({}, ...configs, theaterConfig);
    const theaterId = get(mergedConfig, 'theaterId');
    const saveStateManager = get(this, 'saveStateManagers').findOrCreateInstance(theaterId);
    const savedConfig = saveStateManager.getStateValue('_config') || {};
    const finalConfig = deepMerge({}, mergedConfig, savedConfig);

    return this.createInstance(theaterId, finalConfig);
  },

  _configs: computed({
    get() {
      const paths = Object.keys(requirejs.entries);
      const isConfig = new RegExp(`\/ember-theater\/config`);
      const isTest = new RegExp(`\/tests\/`);
      const isThisService = new RegExp(`\/services\/ember-theater\/config`);

      return paths.filter((path) => {
        return isConfig.test(path) && !isTest.test(path) && !isThisService.test(path);
      }).map((path) => {
        return requirejs(path).default;
      }).filter((config) => {
        return isPresent(config.priority);
      });
    }
  })
});
