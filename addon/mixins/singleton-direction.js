import Ember from 'ember';

export default Ember.Mixin.create({
  direct(line, directables, componentType) {
    directables.forEach((directable) => {
      if (directable.componentType === componentType) {
        directables.removeObject(directable);
      }
    });

    const directable = Ember.Object.create({
      componentType: componentType,
      line: line
    });

    const resolve = line.resolve;
    line.resolve = function(value) {
      directables.removeObject(directable);
      resolve(value);
    }

    directables.pushObject(directable);
  }

});
