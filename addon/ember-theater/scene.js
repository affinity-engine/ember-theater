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

const {
  Promise,
  resolve
} = RSVP;

export default Ember.Object.extend(ModulePrefixMixin, {
  emberTheaterStageManager: inject.service(),
  sceneRecordsCount: -1,

  abort() {
    this.set('isAborted', true);
  },

  handleDirection(type, args) {
    const stageManager = get(this, 'emberTheaterStageManager');
    const factory = get(this, 'container').lookupFactory(`direction:${type}`);

    return stageManager.handleDirection(this, factory, type, args);
  }
});
