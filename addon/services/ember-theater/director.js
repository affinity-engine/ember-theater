import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

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

const Director = Ember.Object.extend({
  sceneManagers: service('ember-theater/director/scene-manager'),

  sceneManager: multiService('sceneManagers'),

  direct(scene, theaterId, factory, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

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
})

export default Service.extend(MultiServiceMixin, {
  factory: Director,

  direct(scene, factory, args) {
    const theaterId = get(scene, 'theaterId');
    const director = this.findOrCreateInstance(theaterId);

    return director.direct(scene, theaterId, factory, args);
  }
});
