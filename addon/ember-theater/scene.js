import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';

const {
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  on,
  RSVP,
  set
} = Ember;

export default Ember.Object.extend(ModulePrefixMixin, {
  emberTheaterStageManager: inject.service(),
  sceneRecordsCount: -1,

  abort() {
    this.set('isAborted', true);
  },

  proxyDirectable(type, factory, line) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'emberTheaterStageManager');

    return stageManager.handleDirectable(factory, type, line, ...this._handleAutoResolve());
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'emberTheaterStageManager');

    return stageManager.handleDirection(factory, type, line, ...this._handleAutoResolve());
  },

  _handleAutoResolve() {
    let autoResolve, autoResolveResult;
    const sceneRecordsCount = this.incrementProperty('sceneRecordsCount');

    if (get(this, 'isLoading')) {
      const sceneRecord = get(this, 'sceneRecord');
      autoResolveResult = sceneRecord[sceneRecordsCount];

      if (autoResolveResult !== undefined) {
        autoResolve = true;
      } else {
        set(this, 'isLoading', false);
      }
    }

    return [autoResolve, autoResolveResult, sceneRecordsCount];
  },
});
