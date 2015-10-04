import Ember from 'ember';

const {
  isEmpty,
  isPresent,
  observer,
  Service
} = Ember;

export default Service.extend({
  setInitialSceneId: observer('sceneId', function() {
    const {
      initialSceneId,
      sceneId
    } = this.getProperties('initialSceneId', 'sceneId');

    if (isEmpty(initialSceneId) && isPresent(sceneId)) {
      this.set('initialSceneId', sceneId);
    }
  }),

  toInitialScene() {
    this.set('sceneId', this.get('initialSceneId'));
  }
});
