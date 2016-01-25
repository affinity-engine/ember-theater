import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get
} = Ember;

const {
  RSVP: {
    Promise,
    resolve
  }
} = Ember;

const { inject: { service } } = Ember;

const Director = Ember.Object.extend(MultiServiceMixin, {
  sceneManagers: service('ember-theater/director/scene-manager'),
  
  sceneManager: multiService('sceneManagers', 'theaterId'),

  direct(scene, factory, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

    const promise = this._direct(factory, args);

    get(this, 'sceneManager').recordSceneRecordEvent(promise, scene);

    return promise;
  },

  _direct(factory, args) {
    const autoResolveProperties = get(this, 'sceneManager').advanceSceneRecord();

    const direction = factory.create(autoResolveProperties);

    return new Promise((resolution) => {
      direction.perform(resolution, ...args);
    });
  }
})

export default Service.extend({
  factory: Director
});
