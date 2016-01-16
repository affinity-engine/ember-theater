import Ember from 'ember';
import deepMerge from 'ember-theater/utils/ember-theater/deep-merge';

const {
  Service,
  computed,
  get,
  isEmpty,
  isPresent,
  on,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  saveStateManager: service('ember-theater/save-state-manager'),

  setGameConfig(gameConfig = {}) {
    set(this, 'gameConfig', gameConfig);
  },

  resetConfig() {
    const gameConfig = get(this, 'gameConfig');
    const configs = get(this, '_configs').sort((a, b) => get(a, 'priority') - get(b, 'priority'));
    const saveStateManager = get(this, 'saveStateManager');
    const savedConfig = saveStateManager.getStateValue('_config') || {};
    const mergedConfig = deepMerge({}, ...configs, gameConfig, savedConfig);

    setProperties(this, mergedConfig);
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
