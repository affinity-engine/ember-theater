import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed,
  get,
  getOwner,
  isBlank,
  merge,
  setProperties
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  directables: computed(() => Ember.A()),

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
    const directable = this.findDirectableWithId(id, componentPath, instanceId);

    if (isBlank(directable)) {
      this._addNewDirectable(merge(properties, { id, componentPath, resolve, instanceId }));
    } else {
      this._updateDirectable(directable, properties, resolve);
    }
  },

  _addNewDirectable(properties) {
    const Directable = getOwner(this).lookup('directable:main');
    const directable = Directable.create(properties);

    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, properties, resolve) {
    const attrs = Ember.$.extend({}, get(directable, 'attrs'), get(properties, 'attrs'));

    setProperties(directable, merge(properties, { resolve, attrs }));
  }
});
