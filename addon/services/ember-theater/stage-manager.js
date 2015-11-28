import Ember from 'ember';

const {
  Service,
  computed,
  get,
  inject,
  isBlank,
  merge,
  setProperties
} = Ember;

const { RSVP: { Promise } } = Ember;

export default Service.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),

  directables: computed(() => Ember.A()),

  clearDirectables() {
    get(this, 'directables').clear();
  },

  removeDirectable(directable) {
    get(this, 'directables').removeObject(directable);
    directable.destroy();
  },

  findDirectableWithId(id, type) {
    return get(this, 'directables').find((directable) => {
      return get(directable, 'id') === id && get(directable, 'type') === type;
    });
  },

  handleDirectable(id, type, properties, resolve) {
    const directable = this.findDirectableWithId(id, type);

    if (isBlank(directable)) {
      this._addNewDirectable(merge(properties, { id, type, resolve }));
    } else {
      this._updateDirectable(directable, properties, resolve);
    }
  },

  _addNewDirectable(properties) {
    const Directable = this.container.lookup('directable:main');
    const directable = Directable.create(properties);

    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, properties, resolve) {
    setProperties(directable, merge(properties, { resolve }));
  },

  handleDirection(factory, type, args) {
    const promise = this._handleDirection(factory, type, ...args);

    return this._handlePromiseResolution(promise);
  },

  _handleDirection(factory, type, ...args) {
    const properties = get(this, 'sceneManager').advanceSceneRecord();
    const direction = factory.create(merge(properties, { type }));

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  _handlePromiseResolution(promise) {
    get(this, 'sceneManager').recordSceneRecordEvent(promise);

    return promise;
  }
});
