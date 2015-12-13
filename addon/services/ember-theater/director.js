import Ember from 'ember';

const {
  Service,
  get,
  merge
} = Ember;

const {
  RSVP: {
    Promise,
    resolve
  }
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  sceneManager: service('ember-theater/director/scene-manager'),

  direct(scene, factory, type, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

    const promise = this._handleDirection(factory, type, ...args);

    return this._handlePromiseResolution(promise, scene);
  },

  _handleDirection(factory, type, ...args) {
    const properties = get(this, 'sceneManager').advanceSceneRecord();
    const direction = factory.create(merge(properties, { type }));

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  },

  _handlePromiseResolution(promise, scene) {
    get(this, 'sceneManager').recordSceneRecordEvent(promise, scene);

    return promise;
  }
});
