import Ember from 'ember';
import Scene from 'ember-theater/models/ember-theater-scene';

const {
  inject
} = Ember;

export default Scene.extend({
  session: inject.service(),

  script: async function(director) {
    const session = this.get('session');
    const autosave = session.get('autosave');
    const nextSceneId = this.get('options.nextSceneId');

    session.persistSave(autosave, nextSceneId);
    director.transitionToScene(nextSceneId);
  }
});
