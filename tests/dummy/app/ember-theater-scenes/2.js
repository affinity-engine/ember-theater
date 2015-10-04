import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function(director) {
    await director.backdrop({ id: 'beach--night', options: { duration: 0 } });
    const test = director.getStat('test');
    director.setStat('test', test + 1);
    director.transitionToScene(2, { autosave: false });
  }
});
