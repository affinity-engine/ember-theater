import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import DirectSceneObject from 'ember-theater/mixins/direct-scene-object';

export default EmberTheaterDirection.createWithMixins(DirectSceneObject, {
  perform(line, sceneObjects) {
    const sceneObject = this.get('store').peekRecord('ember-theater-character', line.id);
    this.directSceneObject(line, sceneObject, sceneObjects);
  }
});
