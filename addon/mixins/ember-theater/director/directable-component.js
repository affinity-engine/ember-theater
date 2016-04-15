import Ember from 'ember';
import BusPublisherMixin from 'ember-theater/mixins/bus-publisher';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Mixin,
  get,
  getProperties,
  isBlank,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { run: { next } } = Ember;

export default Mixin.create(BusPublisherMixin, {
  priorSceneRecord: alias('directable.priorSceneRecord'),

  associateDirectable: on('didInitAttrs', function() {
    const directable = get(this, 'directable');

    if (isBlank(directable)) { return; }

    set(directable, 'component', this);
  }),

  resolveAndDestroy() {
    this.removeDirectable();
    this.resolve();
  },

  resolve() {
    const directable = get(this, 'directable');

    if (isBlank(directable)) { return; }

    const { direction, resolve } = getProperties(directable, 'direction', 'resolve');

    if (isPresent(resolve)) {
      resolve(direction);
    }
  },

  removeDirectable() {
    const { directable, theaterId, windowId } = getProperties(this, 'directable', 'theaterId', 'windowId');

    this.publish(`et:${theaterId}:${windowId}:removingDirectable`, directable);
  }
});
