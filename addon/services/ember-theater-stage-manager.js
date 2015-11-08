import Ember from 'ember';
import { Layer } from 'ember-theater';

const {
  Service,
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  merge,
  set
} = Ember;

const { RSVP: {
  Promise,
  resolve
} } = Ember;

export default Service.extend({
  emberTheaterSceneManager: inject.service(),

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

  handleDirection(factory, type, args) {
    const promise = this._handleDirection(factory, type, ...args);

    return this._handlePromiseResolution(promise);
  },

  _handleDirection(factory, type, ...args) {
    const direction = this._instantiateFactory(factory, { type });

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  handleDirectable(factory, type, line) {
    const promise = this._handleDirectable(factory, type, line);

    return this._handlePromiseResolution(promise);
  },

  _handleDirectable(factory, type, line) {
    const id = get(line, 'id');
    const directable = this.findDirectableWithId(id, type);

    return new Promise((resolve) => {
      set(line, 'resolve', resolve);

      if (isBlank(directable)) {
        this._addNewDirectable(factory, type, line, id);
      } else {
        this._updateDirectable(directable, line);
      }
    });
  },

  _addNewDirectable(factory, type, line, id) {
    const directable = this._instantiateFactory(factory, { id, line, type });
    get(this, 'directables').pushObject(directable);
  },

  _updateDirectable(directable, line) {
    // typically, `advanceSceneRecord` is called in `_instantiateFactory`, but since the directable
    // is already instantiated, we call it manually here.
    get(this, 'emberTheaterSceneManager').advanceSceneRecord();
    set(directable, 'line', line);
  },

  _instantiateFactory(factory, additionalProperties = {}) {
    const properties = get(this, 'emberTheaterSceneManager').advanceSceneRecord();
    merge(properties, additionalProperties);

    return factory.create(properties);
  },

  _handlePromiseResolution(promise) {
    const sceneManager = get(this, 'emberTheaterSceneManager');
    const key = get(sceneManager, 'sceneRecordsCount');

    promise.then((value) => {
      sceneManager.updateSceneRecord(key, value);
    });

    return promise;
  }
});
