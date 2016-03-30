import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import DirectableManagerMixin from 'ember-theater/mixins/ember-theater/director/directable-manager';

const {
  Evented,
  computed,
  get,
  getOwner,
  isBlank,
  merge,
  on,
  set,
  setProperties
} = Ember;

export default Ember.Object.extend(BusSubscriberMixin, DirectableManagerMixin, Evented, MultitonIdsMixin, {
  directables: computed(() => Ember.A()),

  setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:stageIsClearing`, this, this.clearDirectables);
    this.on(`et:${windowId}:removeDirectable`, this, this.removeDirectable);
  }),

  clearDirectables() {
    get(this, 'directables').clear();
  },

  removeDirectable(directable) {
    get(this, 'directables').removeObject(directable);
    directable.destroy();
  },

  _addNewDirectable(properties) {
    this._super(properties);

    const directable = get(properties, 'direction.directable');

    get(this, 'directables').pushObject(directable);
  }
});
