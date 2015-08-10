import Ember from 'ember';

const {
  inject,
  Mixin
} = Ember;

export default Mixin.create({
  pseudoChannelManager: inject.service(),

  direct(line, directables) {
    const componentType = this.get('componentType');

    this.get('pseudoChannels').forEach((pseudoChannel) => {
      const pseudoChannelValues = this.get(`pseudoChannelManager.${pseudoChannel}`);
      directables.forEach((directable) => {
        if (pseudoChannelValues.includes(directable.componentType)) {
          directables.removeObject(directable);
        }
      });
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
