import Ember from 'ember';
import layout from './template';
import multiton from 'ember-multiton-service';

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

const focusDebounceDuration = 100;

export default Component.extend({
  layout,

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live', 'tabIndex'],
  classNames: ['ember-theater'],
  tabIndex: 0,

  multitonManager: service('multiton-service-manager'),
  configService: multiton('ember-theater/config', 'theaterId'),
  producer: multiton('ember-theater/producer', 'theaterId'),
  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),

  isFocused: alias('producer.isFocused'),

  initializeConfig: on('init', function() {
    const config = get(this, 'config');

    set(this, 'theaterId', get(this, 'theaterId') || 'ember-theater-default');
    get(this, 'configService').initializeConfig(config);

    this._loadfixtures();
  }),

  destroyMultitons: on('willDestroyElement', function() {
    const theaterId = get(this, 'theaterId');

    get(this, 'multitonManager').removeServices(theaterId);
  }),

  claimFocus: on('focusIn', function() {
    debounce(this, () => set(this, 'isFocused', true), focusDebounceDuration);
  }),

  relinquishFocus: on('focusOut', function() {
    debounce(this, () => set(this, 'isFocused', false), focusDebounceDuration);
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
