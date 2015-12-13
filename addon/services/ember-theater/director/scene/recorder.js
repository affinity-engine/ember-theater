import Ember from 'ember';

const {
  Service,
  get,
  inject,
  isBlank,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

export default Service.extend({
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneManager: service('ember-theater/director/scene-manager'),

  sceneRecord: alias('saveStateManager.activeState._sceneRecord'),

  reset(isLoading) {
    set(this, 'sceneRecordIndex', -1);

    if (!isLoading) {
      set(this, 'sceneRecord', Ember.Object.create());
    }
  },

  record(promise, scene) {
    const key = get(this, 'sceneRecordIndex');

    promise.then((value) => {
      if (get(scene, 'isAborted')) { return; }

      this._update(key, value);
    });
  },

  advance() {
    const sceneManager = get(this, 'sceneManager');

    this._ensureSceneRecord();
    this._ensureValue(get(this, 'sceneRecordIndex'));

    const sceneRecordIndex = this.incrementProperty('sceneRecordIndex');

    if (!get(sceneManager, 'isLoading')) { return {}; }

    const sceneRecord = get(this, 'sceneRecord');
    const autoResolveResult = get(sceneRecord, sceneRecordIndex.toString());

    if (autoResolveResult !== undefined) {
      return { autoResolve: true, autoResolveResult };
    }

    set(sceneManager, 'isLoading', false);

    return {};
  },

  _update(key, value) {
    set(this, `sceneRecord.${key}`, isBlank(value) ? null : value);
  },

  _ensureSceneRecord() {
    if (isBlank(get(this, 'sceneRecord'))) {
      this.reset();
    }
  },

  _ensureValue(key) {
    if (key >= 0 && this._getRecord(key) === undefined) {
      this._update(key, null);
    }
  },

  _getRecord(key) {
    return get(this, `sceneRecord.${key}`);
  }
});
