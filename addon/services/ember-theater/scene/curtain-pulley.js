import Ember from 'ember';

const {
  Service,
  get,
  isEmpty
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  saveStateManager: service('ember-theater/save-state-manager'),

  liftCurtains: async function() {
    const saveStateManager = get(this, 'saveStateManager');
    const options = { autosave: false, isLoading: true };
    const save = await get(saveStateManager, 'mostRecentSave');
    let id = get(save, 'activeState.sceneId');

    if (isEmpty(id)) {
      id = get(this, 'config.initial.sceneId');
      options.autosave = true;
    }

    saveStateManager.loadRecord(save);

    return { id, options };
  }
});
