import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get,
  isBlank,
  isPresent,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

const Recorder = Ember.Object.extend({
  saveStateManagers: service('ember-theater/save-state-manager'),
  sceneManagers: service('ember-theater/director/scene-manager'),
  
  saveStateManager: multiService('saveStateManagers', 'theaterId'),
  sceneManager: multiService('sceneManagers', 'theaterId'),

  sceneRecord: alias('saveStateManager.activeState._sceneRecord'),

  resetRecord() {
    this.resetIndex();

    set(this, 'sceneRecord', Ember.Object.create());
  },

  resetIndex() {
    set(this, 'sceneRecordIndex', 0);
  },

  record(promise, scene) {
    const key = get(this, 'sceneRecordIndex');

    promise.then((value) => {
      if (get(scene, 'isAborted')) { return; }

      this._update(key, value);
    });
  },

  advance(isLoading) {
    this._ensureSceneRecord();

    const index = this.incrementProperty('sceneRecordIndex');
    const result = isLoading ? this._autoAdvance(index) : this._advance(index);

    return result || {};
  },

  _ensureSceneRecord() {
    if (isBlank(get(this, 'sceneRecord'))) {
      this.resetRecord();
    }
  },

  _autoAdvance(index) {
    const autoResolveResult = get(this, `sceneRecord.${index}`);

    if (isPresent(autoResolveResult)) {
      return { autoResolve: true, autoResolveResult };
    } else {
      get(this, 'sceneManager').setIsLoading(false);
    }
  },

  _advance(index) {
    this._update(index, '_UNRESOLVED');
  },

  _update(key, value) {
    set(this, `sceneRecord.${key}`, isPresent(value) ? value : '_RESOLVED');
  }
})

export default Service.extend(MultiServiceMixin, {
  factory: Recorder
});
