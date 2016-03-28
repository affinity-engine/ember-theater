import Ember from 'ember';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Mixin,
  get,
  getProperties,
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

    set(directable, 'component', this);
  }),

  resolve() {
    get(this, 'directable').resolve(get(this, 'directable.direction'));
  },

  resolveAndDestroy() {
    const directable = get(this, 'directable');
    const { direction, resolve } = getProperties(directable, 'direction', 'resolve');

    this.removeDirectable();

    next(() => {
      resolve(direction);
    });
  },

  removeDirectable() {
    const { directable, windowId } = getProperties(this, 'directable', 'windowId');

    this.publish(`et:${windowId}:removeDirectable`, directable);
  }
});
