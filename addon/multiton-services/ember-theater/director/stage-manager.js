import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';

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

const { run: { later } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, Evented, MultitonIdsMixin, {
  directables: computed(() => Ember.A()),

  setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:stageIsClearing`, this, this.clearDirectables);
  }),

  clearDirectables() {
    get(this, 'directables').clear();
  },

  removeDirectable(directable) {
    get(this, 'directables').removeObject(directable);
    directable.destroy();
  },

  findDirectableWithId(id, componentPath, instanceId) {
    return get(this, 'directables').find((directable) => {
      return get(directable, 'id') === id &&
        get(directable, 'componentPath') === componentPath &&
        get(directable, 'instanceId') === instanceId;
    });
  },

  handleDirectable(id, componentPath, properties, resolve) {
    const instanceId = get(properties, 'attrs.instance') || 0;
    const directable = get(properties, 'direction.directable');
    const delay = get(properties, 'attrs.delay') || 0;

    later(() => {
      if (isBlank(directable)) {
        this._addNewDirectable(merge(properties, { id, componentPath, resolve, instanceId }));
      } else {
        this._updateDirectable(directable, properties, resolve);
      }
    }, delay);
  },

  _addNewDirectable(properties) {
    const Directable = getOwner(this).lookup('directable:main');
    const directable = Directable.create(properties);

    set(get(properties, 'direction'), 'directable', directable);

    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, properties, resolve) {
    const attrs = Ember.$.extend({}, get(directable, 'attrs'), get(properties, 'attrs'));

    setProperties(directable, merge(properties, { resolve, attrs }));
  }
});
