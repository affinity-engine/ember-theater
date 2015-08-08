import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

export default EmberTheaterDirection.create({
  perform(line, directables) {
    directables.forEach((directable) => {
      if (directable.componentType === 'ember-theater-stage-choice') {
        directables.removeObject(directable);
      }
    });

    const directable = Ember.Object.create({
      componentType: 'ember-theater-stage-choice',
      line: line
    });

    const resolve = line.resolve;
    line.resolve = function(choice) {
      directables.removeObject(directable);
      resolve(choice);
    }

    directables.pushObject(directable);
  }
});
