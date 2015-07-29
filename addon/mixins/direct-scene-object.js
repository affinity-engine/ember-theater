import Ember from 'ember';

const { 
  inject, 
  Mixin 
} = Ember;

export default Mixin.create({
  store: inject.service(),

  directSceneObject(line, sceneObject, sceneObjectContainers) {
    if (line.destroy) { 
      this._alterSceneObject(sceneObjectContainers, line.id, (container) => {
        sceneObjectContainers.removeObject(container);
      });

      return line.sync = false; 
    }

    if (!sceneObjectContainers.isAny('sceneObject.id', line.id)) { 
      const sceneObjectContainer = Ember.Object.create({
        line: line,
        sceneObject: sceneObject
      });

      sceneObjectContainers.pushObject(sceneObjectContainer); 
    } else {
      this._alterSceneObject(sceneObjectContainers, line.id, (container) => {
        container.set('line', line);
      });
    }
  },

  _alterSceneObject(sceneObjectContainers, id, callback) {
    const container = sceneObjectContainers.find((container) => {
      return container.get('sceneObject.id') === id;
    });

    callback(container);
  }
});
