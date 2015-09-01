import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function() {
    this.backdrop({ id: 'beach--night', options: { duration: 5000 } });
  }
});
