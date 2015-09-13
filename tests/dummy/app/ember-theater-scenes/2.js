import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function(director) {
    await director.backdrop({ id: 'beach--night', options: { duration: 0 } });
    director.transitionToScene('save', { nextSceneId: 2 });
  }
});
