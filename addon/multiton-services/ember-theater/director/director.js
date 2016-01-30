import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  Service,
  get,
  set
} = Ember;

const {
  RSVP: {
    Promise,
    resolve
  }
} = Ember;

const { inject: { service } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

  direct(scene, factory, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

    const theaterId = get(scene, 'theaterId');
    const promise = this._direct(factory, theaterId, args);

    get(this, 'sceneManager').recordSceneRecordEvent(promise, scene);

    return promise;
  },

  _direct(factory, theaterId, args) {
    const autoResolveProperties = get(this, 'sceneManager').advanceSceneRecord();

    const direction = factory.create(autoResolveProperties);

    set(direction, 'theaterId', theaterId);

    return new Promise((resolution) => {
      direction.perform(resolution, ...args);
    });
  }
});
