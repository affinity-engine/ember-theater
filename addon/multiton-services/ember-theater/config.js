import Ember from 'ember';
import deepMerge from 'ember-theater/utils/ember-theater/deep-merge';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed,
  get,
  isEmpty,
  isPresent,
  set,
  setProperties,
  on,
} = Ember;

export default Ember.Object.extend(BusSubscriberMixin, TheaterIdMixin, {
  attrs: computed(() => Ember.Object.create()),

  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  initializeConfig(theaterConfig = {}) {
    set(this, 'theaterConfig', theaterConfig);

    return this.resetConfig();
  },

  resetConfig: on('et:reseting', function() {
    const theaterConfig = get(this, 'theaterConfig');
    const configs = get(this, '_configs').sort((a, b) => get(a, 'priority') - get(b, 'priority'));
    const saveStateManager = get(this, 'saveStateManager');
    const savedConfig = saveStateManager.getStateValue('_config') || {};
    const mergedConfig = deepMerge({}, ...configs, theaterConfig, savedConfig);
    const attrs = get(this, 'attrs');

    return setProperties(attrs, mergedConfig);
  }),

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
