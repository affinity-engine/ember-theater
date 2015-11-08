import Ember from 'ember';
import { Layer } from 'ember-theater';

const {
  computed,
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

  handleDirectable(factory, type, line, autoResolve, autoResolveResult, sceneRecordsCount) {
    const promise = this._handleDirectable(factory, type, line, autoResolve, autoResolveResult);

    return this._handlePromiseResolution(promise, sceneRecordsCount);
  },

  handleDirection(factory, type, args, autoResolve, autoResolveResult, sceneRecordsCount) {
    const direction = this._instantiateFactory(factory, { autoResolve, autoResolveResult, type });
    const promise = this._handleDirection(direction, ...args);

    return this._handlePromiseResolution(promise, sceneRecordsCount);
  },

  _handleDirection(direction, ...args) {
    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  _handleDirectable(factory, type, line, autoResolve, autoResolveResult) {
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

  _handlePromiseResolution(promise, sceneRecordsCount) {
    promise.then((value) => {
      const sceneManager = this.get('emberTheaterSceneManager');
      sceneManager.updateSceneRecord(sceneRecordsCount, value);
    });

    return promise;
  }
});
