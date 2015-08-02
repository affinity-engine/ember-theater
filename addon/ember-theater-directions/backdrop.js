import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import DirectSceneObject from 'ember-theater/mixins/direct-scene-object';

export default EmberTheaterDirection.createWithMixins(DirectSceneObject, {
  perform(line, sceneObjects) {
    this.directSceneObject(line, sceneObjects, 'ember-theater-stage-backdrop');
  }
});
