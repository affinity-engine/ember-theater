import { Scene } from 'ember-theater';

export default Scene.extend({
  script: async function() {
    await this.backdrop('beach--night', { duration: 0 });
    const test = await this.getData('test');

    this.setData('test', test + 1);
    this.transitionToScene(2, { autosave: false });
  }
});
