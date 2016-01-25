import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const { inject } = Ember;

export default Direction.extend({
  sceneManagers: inject.service('ember-theater/director/scene-manager'),

  sceneManager: multiService('sceneManagers', 'theareId'),

  perform(resolve, sceneId, options) {
    resolve();

    this.get('sceneManager').toScene(sceneId, options);
  }
});
