import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const { inject } = Ember;

export default Direction.extend({
  sceneManager: inject.service('ember-theater/director/scene-manager'),

  perform(resolve, sceneId, options) {
    resolve();

    this.get('sceneManager').toScene(sceneId, options);
  }
});
