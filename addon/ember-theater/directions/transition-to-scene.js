import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  emberTheaterSceneManager: inject.service(),

  perform(resolve, sceneId, options) {
    this.get('emberTheaterSceneManager').toScene(sceneId, options);

    resolve();
  }
});
