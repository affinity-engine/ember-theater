import Ember from 'ember';
import nativeCopy from 'ember-theater/utils/native-copy';

const {
  computed,
  get,
  isBlank,
  isPresent,
  merge,
  Service,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  store: service(),

  activeState: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),

  mostRecentSave: computed('saves.@each.updated', {
    get: async function() {
      await this._ensureAutosave();

      const saves = await get(this, 'saves');

      return saves.sortBy('updated').reverseObjects().get('firstObject');
    }
  }).readOnly(),

  autosave: computed({
    get() {
      return this.get('store').queryRecord('ember-theater/local-save', {
        isAutosave: true
      });
    }
  }).readOnly(),

  _ensureAutosave: async function() {
    if (isPresent(await get(this, 'autosave'))) { return; }

    const autosave = await this.createRecord('autosave');

    set(autosave, 'isAutosave', true);
    autosave.save();
    this.notifyPropertyChange('autosave');
  },

  saves: computed({
    get: async function() {
      return await this.get('store').findAll('ember-theater/local-save');
    }
  }).readOnly(),

  resetAutosave: async function() {
    const autosave = await this.get('autosave');

    this.set('activeState', Ember.Object.create());
    this.get('statePoints').clear();

    this.updateRecord(autosave);
  },

  // RECORD MANAGEMENT //
  createRecord: async function(name) {
    const statePoints = nativeCopy(this.get('statePoints'));
    const record = this.get('store').createRecord('ember-theater/local-save', {
      name,
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
      statePoints
    } = record.getProperties('activeState', 'statePoints');

    this.setProperties({
      activeState: nativeCopy(activeState),
      statePoints: Ember.A(nativeCopy(statePoints))
    });
  },

  updateRecord: async function(record) {
    const statePoints = nativeCopy(this.get('statePoints'));

    record.setProperties({
      statePoints
    });

    return await record.save();
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
