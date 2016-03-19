import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

  direct(script, factory, args) {
    if (get(script, 'isAborted')) { return resolve(); }

    const theaterId = get(script, 'theaterId');
    const { autoResolve, autoResolveResult } = get(this, 'sceneManager').advanceSceneRecord();
    const direction = factory.create({ autoResolve, autoResolveResult, script, theaterId });

    return direction.setup(...args);
  }
});
