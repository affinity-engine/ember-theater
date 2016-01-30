import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  isBlank,
  isPresent,
  set
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

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
});
