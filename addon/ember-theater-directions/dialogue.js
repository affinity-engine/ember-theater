import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

export default EmberTheaterDirection.create({
  perform(line, directables) {
    directables.forEach((directable) => {
      if (directable.componentType === 'ember-theater-stage-dialogue') {
        directables.removeObject(directable);
      }
    });

    const directable = Ember.Object.create({
      componentType: 'ember-theater-stage-dialogue',
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
