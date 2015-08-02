import Ember from 'ember';

const { 
  inject, 
  Mixin 
} = Ember;

export default Mixin.create({
  store: inject.service(),

  directSceneObject(line, sceneObjectContainers, componentType) {
    if (line.destroy) { 
      this._alterSceneObject(sceneObjectContainers, line.id, (container) => {
        sceneObjectContainers.removeObject(container);
      });

      return line.sync = false; 
    }

    if (!sceneObjectContainers.isAny('line.id', line.id)) { 
      const sceneObjectContainer = Ember.Object.create({
        componentType: componentType,
        line: line
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
      return container.get('line.id') === id;
    });

    callback(container);
  }
});
