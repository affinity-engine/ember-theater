import Ember from 'ember';

const { Mixin, inject } = Ember;

export default Mixin.create({
  store: inject.service(),

  directSceneObject(line, sceneObject, sceneObjects) {
    sceneObject.set('line', line);

    if (line.destroy) { sceneObjects.removeObject(sceneObject); return line.resolve(); }
    if (!sceneObjects.isAny('id', line.id)) { sceneObjects.pushObject(sceneObject); }
  }
});
