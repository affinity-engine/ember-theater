import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

export default EmberTheaterDirection.create({
  perform(line, directables) {
    directables.forEach((container) => {
      if (container.componentType === 'ember-theater-stage-speech') {
        directables.removeObject(container);
      }
    });

    const directable = Ember.Object.create({
      componentType: 'ember-theater-stage-speech',
      line: line
    });

    const resolve = line.resolve;
    line.resolve = function() {
      directables.removeObject(directable);
      resolve();
    }

    directables.pushObject(directable);
  }
});
