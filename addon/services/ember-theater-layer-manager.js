import Ember from 'ember';

const {
  computed,
  Service
} = Ember;

export default Service.extend({
  filters: computed(() => Ember.A()),

  getFilter(layer) {
    return this.get('filters').find((filter) => {
      return filter.get('layer') === layer;
    });
  },

  completeFilterTransition(layer) {
    const filter = this.getFilter(layer);

    filter.setProperties({
      duration: 0,
      previousFilter: undefined
    });
  },

  addFilter(effect, duration, layer) {
    const filter = this.getFilter(layer);
    
    if (filter) {
      const previousFilter = filter.get('effect');
      
      filter.setProperties({
        duration,
        effect,
        previousFilter
      });
    } else {
      this.get('filters').addObject(Ember.Object.create({ duration, effect, layer }));
    }
  },

  clearFilters() {
    this.get('filters').clear();
  }
});
