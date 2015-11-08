import Ember from 'ember';
import { Layer } from 'ember-theater';

const {
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  Service,
  RSVP
} = Ember;

const {
  Promise,
  resolve
} = RSVP;

export default Service.extend({
  emberTheaterSceneManager: inject.service(),

  directables: computed(() => Ember.A()),

  clearDirectables() {
    this.get('directables').clear();
  },

  removeDirectable(directable) {
    this.get('directables').removeObject(directable);
    directable.destroy();
  },

  findDirectableWithId(id, type) {
    if (isBlank(id)) { return; }

    return this.get('directables').find((directable) => {
      return directable.get('line.id') === id && directable.get('type') === type;
    });
  },

  handleDirection(factory, type, args) {
    const promise = this._handleDirection(factory, ...args);

    return this._handlePromiseResolution(promise);
  },

  _handleDirection(factory, ...args) {
    const { autoResolve, autoResolveResult } = this.get('emberTheaterSceneManager').advanceSceneRecord();
    const direction = this._instantiateFactory(factory, { autoResolve, autoResolveResult, type });

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  handleDirectable(factory, type, line) {
    const promise = this._handleDirectable(factory, type, line);

    return this._handlePromiseResolution(promise);
  },

  _handleDirectable(factory, type, line) {
    const { autoResolve, autoResolveResult } = this.get('emberTheaterSceneManager').advanceSceneRecord();
    const director = this.get('director');
    const activeDirectable = this.findDirectableWithId(line.id, type);

    return new Promise((resolve) => {
      line.resolve = resolve;

      if (isBlank(activeDirectable)) {
        const directable = this._instantiateFactory(factory, { autoResolve, autoResolveResult, line, type });

        this.get('directables').pushObject(directable);
      } else {
        activeDirectable.set('line', line);
      }
    });
  },

  _instantiateFactory(factory, properties) {
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
