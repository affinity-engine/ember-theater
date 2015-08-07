import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

export default EmberTheaterDirection.create({
  perform(line, sceneObjectContainers) {
    sceneObjectContainers.forEach((container) => {
      if (container.componentType === 'ember-theater-stage-speech') {
        sceneObjectContainers.removeObject(container);
      }
    });

    const sceneObjectContainer = Ember.Object.create({
      componentType: 'ember-theater-stage-speech',
      line: line
    });

    const resolve = line.resolve;
    line.resolve = function() {
      sceneObjectContainers.removeObject(sceneObjectContainer);
      resolve();
    }

    sceneObjectContainers.pushObject(sceneObjectContainer);
  }
});
