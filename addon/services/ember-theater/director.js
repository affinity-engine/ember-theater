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

  direct(scene, factory, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

    const promise = this._direct(factory, args);

    get(this, 'sceneManager').recordSceneRecordEvent(promise, scene);

    return promise;
  },

  _direct(factory, args) {
    const autoResolveProperties = get(this, 'sceneManager').advanceSceneRecord();

    const direction = factory.create(autoResolveProperties);

    return new Promise((resolve) => {
      direction.perform(resolve, ...args);
    });
  }
});
