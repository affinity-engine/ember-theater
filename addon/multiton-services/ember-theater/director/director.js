import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

  direct(scene, factory, args) {
    if (get(scene, 'isAborted')) { return resolve(); }

    const theaterId = get(scene, 'theaterId');
    const { autoResolve, autoResolveResult } = get(this, 'sceneManager').advanceSceneRecord();
    const direction = factory.create({ autoResolve, autoResolveResult, scene, theaterId });

    return direction.setup(...args);
  }
});
