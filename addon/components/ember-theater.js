import Ember from 'ember';
import layout from '../templates/components/ember-theater';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
  isNone,
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

  hook: 'ember_theater',

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

  init() {
    this._ensureTheaterId();
    get(this, 'configService').initializeConfig(get(this, 'config'));
    this._loadfixtures();

    this._super();
  },

  _ensureTheaterId() {
    if (isNone(get(this, 'theaterId'))) {
      set(this, 'theaterId', 'ember-theater-default');
    }
  },

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

  actions: {
    completePreload() {
      set(this, 'isLoaded', true);
    }
  }
});
