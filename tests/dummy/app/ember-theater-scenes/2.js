import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function(director) {
    director.backdrop({ id: 'beach--night', options: { duration: 5000 } });
    director.transitionToScene('save', { nextSceneId: 2 });
  }
});
