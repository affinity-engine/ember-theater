import Ember from 'ember';

const {
  Service,
  get,
  merge
} = Ember;

const { inject: { service } } = Ember;
const { RSVP: { Promise } } = Ember;

export default Service.extend({
  sceneManager: service('ember-theater/director/scene-manager'),

  direct(factory, type, args) {
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
