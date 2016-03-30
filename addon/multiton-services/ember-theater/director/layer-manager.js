import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import layerName from 'ember-theater/utils/ember-theater/director/layer-name';

const {
  Evented,
  computed,
  generateGuid,
  get,
  getOwner,
  getProperties,
  isBlank,
  merge,
  on,
  set,
  setProperties,
  typeOf
} = Ember;

const { run: { later } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, Evented, MultitonIdsMixin, {
  dynamicStylesheet: service(),

  filters: computed(() => Ember.A()),
  layers: computed(() => Ember.A()),

  setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:stageIsClearing`, this, this.clearFilters);
  }),

  registerLayer(layer) {
    get(this, 'layers').pushObject(layer);
  },

  unregisterLayer(layer) {
    get(this, 'layers').removeObject(layer);
  },

  getLayer(name) {
    return get(this, 'layers').find((layer) => get(layer, 'layerName') === layerName(name));
  },

  handleDirectable(layerName, properties, resolve) {
    const directable = get(properties, 'direction.directable');
    const delay = get(properties, 'attrs.delay') || 0;

    later(() => {
      if (isBlank(directable)) {
        this._addNewDirectable(layerName, merge(properties, { resolve }));
      } else {
        this._updateDirectable(directable, properties, resolve);
      }
    }, delay);
  },

  _addNewDirectable(layerName, properties) {
    const Directable = getOwner(this).lookup('directable:main');
    const directable = Directable.create(properties);
    const layer = this.getLayer(layerName);

    set(get(properties, 'direction'), 'directable', directable);
    set(layer, 'directable', directable);
  },

  _updateDirectable(directable, properties, resolve) {
    const attrs = Ember.$.extend({}, get(directable, 'attrs'), get(properties, 'attrs'));

    setProperties(directable, merge(properties, { resolve, attrs }));
  },

  getFilter(layer) {
    return this.get('filters').find((filter) => {
      return filter.get('layer') === layer;
    });
  },

  addFilter(resolve, effect, { duration = 0, timing = 'linear', iterations = 1, destroy }, layer) {
    const filters = get(this, 'filters');
    const filter = this.getFilter(layer) || Ember.Object.create({ layer });
    const previousKeyframes = get(filter, 'keyframes');
    const animationName = generateGuid(filter, 'filter');
    const animation = `keyframeName ${duration}ms ${timing} ${iterations}`;
    const effects = typeOf(effect) === 'array' ? effect : [effect];
    const totalEffects = effects.length - 1;
    const keyframeStates = effects.reduce((states, state, index) => {
      const percent = index / totalEffects * 100;

      return `${states}${percent}%{-webkit-filter:${state};filter:${state};}`;
    }, '');
    const keyframes = `@keyframes ${animationName} { ${keyframeStates} }`;
    const dynamicStylesheet = get(this, 'dynamicStylesheet');

    dynamicStylesheet.deleteRule(previousKeyframes);
    dynamicStylesheet.insertRule(keyframes);

    setProperties(filter, {
      animation,
      animationName,
      duration,
      keyframes,
      resolve,
      effect: effects[totalEffects]
    });

    if (!filters.any((item) => get(item, 'layer') === layer)) {
      filters.pushObject(filter);
    }

    if (destroy) {
      later(() => {
        this.destroyFilter(filter);
      }, duration);
    }
  },

  destroyFilter(filter) {
    const { dynamicStylesheet, filters } = getProperties(this, 'dynamicStylesheet', 'filters');
    const keyframes = get(filter, 'keyframes');

    dynamicStylesheet.deleteRule(keyframes);
    filters.removeObject(filter);
    filter.destroy();
  },

  clearFilters() {
    get(this, 'filters').forEach((filter) => {
      this.destroyFilter(filter);
    });
  }
});
