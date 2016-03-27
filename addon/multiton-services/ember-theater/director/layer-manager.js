import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  computed,
  generateGuid,
  get,
  getProperties,
  setProperties,
  typeOf
} = Ember;

const { run: { later } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend(MultitonIdsMixin, {
  dynamicStylesheet: service(),

  filters: computed(() => Ember.A()),

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
