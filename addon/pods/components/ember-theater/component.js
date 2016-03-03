import Ember from 'ember';
import layout from './template';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  get,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;
const { run: { debounce } } = Ember;

export default Component.extend({
  layout,

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live', 'tabIndex'],
  classNames: ['ember-theater'],
  tabIndex: 0,

  multitonServiceManager: service('multiton-service-manager'),
  configService: multitonService('ember-theater/config', 'theaterId'),
  producer: multitonService('ember-theater/producer', 'theaterId'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  isFocused: alias('producer.isFocused'),

  initializeConfig: on('init', function() {
    const config = get(this, 'config');
    const theaterId = get(this, 'theaterId') || 'ember-theater-default';

    set(this, 'theaterId', theaterId);
    get(this, 'configService').initializeConfig(config);

    this._loadfixtures();
  }),

  destroyMultitons: on('willDestroyElement', function() {
    const theaterId = get(this, 'theaterId');

    get(this, 'multitonServiceManager').removeServices(theaterId);
  }),

  claimFocus: on('focusIn', function() {
    debounce(this, () => set(this, 'isFocused', true), 100);
  }),

  relinquishFocus: on('focusOut', function() {
    debounce(this, () => set(this, 'isFocused', false), 100);
  }),

  _loadfixtures() {
    const fixtureStore = get(this, 'fixtureStore');
    const fixtureMap = get(this, 'fixtures');

    if (isPresent(fixtureMap)) {
      const fixtureKeys = Object.keys(fixtureMap);

      fixtureKeys.forEach((key) => {
        fixtureStore.add(key, fixtureMap[key]);
      });
    }
  },

  actions: {
    completePreload() {
      set(this, 'isLoaded', true);
    }
  }
});
