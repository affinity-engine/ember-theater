import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  start: async function(script) {
    await script.Text('Hello!');
    script.Scene().close();
  }
});
