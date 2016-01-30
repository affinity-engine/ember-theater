import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

export default Direction.extend({
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theareId'),

  perform(resolve, sceneId, options) {
    resolve();

    this.get('sceneManager').toScene(sceneId, options);
  }
});
