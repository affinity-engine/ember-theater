import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),

  perform(resolve, sceneId, options) {
    this.get('sceneManager').toScene(sceneId, options);

    resolve();
  }
});
