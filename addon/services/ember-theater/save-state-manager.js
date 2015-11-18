import Ember from 'ember';
import nativeCopy from 'ember-theater/utils/native-copy';

const {
  computed,
  isBlank,
  isEmpty,
  isPresent,
  merge,
  on,
  Service,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  store: service(),

  activeState: computed(() => Ember.Object.create()),
  sceneRecord: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),

  initializeState: on('init', async function() {
    const autosave = await this.get('autosave');

    if (isPresent(autosave)) {
      this.loadRecord(autosave);
    }
  }),

  autosave: computed({
    get: async function() {
      let autosave = await this.get('store').queryRecord('ember-theater/local-save', {
        isAutosave: true
      });

      if (isEmpty(autosave)) {
        autosave = await this.createRecord('autosave');
        set(autosave, 'isAutosave', true);
      }

      return autosave;
    }
  }).readOnly(),

  saves: computed({
    get: async function() {
      return await this.get('store').findAll('ember-theater/local-save');
    }
  }).readOnly(),

  resetAutosave: async function() {
    const autosave = await this.get('autosave');

    this.set('activeState', Ember.Object.create());
    this.set('sceneRecord', Ember.Object.create());
    this.get('statePoints').clear();

    this.updateRecord(autosave);
  },

  // RECORD MANAGEMENT //
  createRecord: async function(name) {
    const sceneRecord = nativeCopy(this.get('sceneRecord'));
    const statePoints = nativeCopy(this.get('statePoints'));
    const record = this.get('store').createRecord('ember-theater/local-save', {
      name,
      sceneRecord,
      statePoints
    });

    return await record.save();
  },

  deleteRecord: async function(record) {
    return await record.destroyRecord();
  },

  loadRecord(record) {
    record.reload();

    const {
      activeState,
      sceneRecord,
      statePoints
    } = record.getProperties('activeState', 'sceneRecord', 'statePoints');

    this.setProperties({ activeState, sceneRecord, statePoints });
  },

  updateRecord: async function(record) {
    const sceneRecord = nativeCopy(this.get('sceneRecord'));
    const statePoints = nativeCopy(this.get('statePoints'));

    record.setProperties({
      sceneRecord,
      statePoints
    });

    return await record.save();
  },

  // SCENE RECORD MANAGEMENT //
  updateSceneRecord(key, value) {
    this.set(`sceneRecord.${key}`, isBlank(value) ? null : value);
  },

  clearSceneRecord() {
    this.set('sceneRecord', Ember.Object.create());
  },

  // STATE MANAGEMENT //
  appendActiveState(optionalValues) {
    const activeState = nativeCopy(this.get('activeState'));
    const mergedState = merge(activeState, optionalValues);

    this.get('statePoints').pushObject(mergedState);
    this.set('activeState', activeState);
  },

  loadStatePoint(statePoints) {
    const activeState = statePoints.get('lastObject');

    this.setProperties({ activeState, statePoints });
    this.clearSceneRecord();
  },

  deleteStateValue(key) {
    return this.setStateValue(key, null);
  },

  getStateValue(key) {
    return this.get(`activeState.${key}`);
  },

  setStateValue(key, value) {
    return this.set(`activeState.${key}`, value);
  }
});
