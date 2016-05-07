import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import { BusSubscriberMixin } from 'ember-message-bus';
import DirectableManagerMixin from 'ember-theater/mixins/ember-theater/director/directable-manager';

const {
  Evented,
  computed,
  get,
  getProperties,
  on
} = Ember;

export default MultitonService.extend(BusSubscriberMixin, DirectableManagerMixin, Evented, MultitonIdsMixin, {
  directables: computed(() => Ember.A()),

  setupEvents: on('init', function() {
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');

    this.on(`et:${theaterId}:${windowId}:stageIsClearing`, this, this.clearDirectables);
    this.on(`et:${theaterId}:${windowId}:removingDirectable`, this, this.removeDirectable);
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
