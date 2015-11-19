import Ember from 'ember';

const {
  get,
  inject,
  isEmpty,
  isPresent,
  observer,
  Service,
  set,
  setProperties
} = Ember;

export default Service.extend({
  saveStateManager: inject.service('ember-theater/save-state-manager'),
  sceneManager: inject.service('ember-theater/scene-manager'),

  resetIndex() {
    set(this, 'sceneRecordIndex', -1);
  },

  recordEvent(promise) {
    const key = get(this, 'sceneRecordIndex');

    promise.then((value) => {
      this._update(key, value);
    });
  },

  advance() {
    const sceneManager = get(this, 'sceneManager');

    this._ensureValue(get(this, 'sceneRecordIndex'));

    const sceneRecordIndex = this.incrementProperty('sceneRecordIndex');

    if (!get(sceneManager, 'isLoading')) { return {}; }

    const sceneRecord = get(this, 'saveStateManager.sceneRecord');
    const autoResolveResult = get(sceneRecord, sceneRecordIndex.toString());

    if (autoResolveResult !== undefined) {
      return { autoResolve: true, autoResolveResult };
    }

    set(sceneManager, 'isLoading', false);

    return {};
  },

  _update(key, value) {
    get(this, 'saveStateManager').updateSceneRecord(key, value);
  },

  _ensureValue(key) {
    if (key >= 0 && this._getRecord(key) === undefined) {
      this._update(key, null);
    }
  },

  _getRecord(key) {
    return get(this, 'saveStateManager').getSceneRecordValue(key);
  },

});
