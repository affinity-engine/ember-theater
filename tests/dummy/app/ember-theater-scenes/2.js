import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function(director) {
    console.log(director.getStat('test'));
    director.backdrop({ id: 'beach--night', options: { duration: 5000 } });
  }
});
