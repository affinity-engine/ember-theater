import Ember from 'ember';

const {
  computed,
  inject,
  isEmpty,
  isPresent,
  merge,
  on,
  Service
} = Ember;

export default Service.extend({
  activeState: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),
  store: inject.service(),

  initializeState: on('init', async function() {
    const autosave = await this.get('autosave');

    if (isPresent(autosave)) {
      this.loadRecord(autosave);
    }
  }),

  autosave: computed({
    get: async function() {
      let autosave = await this.get('store').queryRecord('ember-theater-local-save', {
        name: 'autosave'
      });

      if (isEmpty(autosave)) {
        autosave = await this.createRecord('autosave');
      }

      return autosave;
    }
  }).readOnly(),

  saves: computed({
    get: async function() {
      return await this.get('store').findAll('ember-theater-local-save');
    }
  }).readOnly(),

  resetAutosave: async function() {
    const autosave = await this.get('autosave');
    
    this.get('statePoints').clear();
    this.set('activeState', Ember.Object.create());

    this.updateRecord(autosave);
  },

  // RECORD MANAGEMENT //
  createRecord: async function(name) {
    const statePoints = Ember.$.extend([], this.get('statePoints'));
    const record = this.get('store').createRecord('ember-theater-local-save', {
      name,
      statePoints
    });

    return await record.save();
  },

  deleteRecord: async function(record) {
    return await record.destroyRecord();
  },

  loadRecord(record) {
    const { activeState, statePoints } = record.getProperties('activeState', 'statePoints');

    this.setProperties({ activeState, statePoints });
  },

  updateRecord: async function(record) {
    const statePoints = Ember.$.extend([], this.get('statePoints'));

    record.set('statePoints', statePoints);

    return await record.save();
  },

  // STATE MANAGEMENT // 
  appendActiveState(optionalValues) {
    const activeState = Ember.$.extend({}, this.get('activeState'));
    const mergedState = merge(activeState, optionalValues);

    this.get('statePoints').pushObject(mergedState);
  },

  deleteStateValue(key) {
    return this.setStateValue(key, undefined);
  },

  getStateValue(key) {
    return this.get(`activeState.${key}`);
  },

  setStateValue(key, value) {
    return this.set(`activeState.${key}`, value);
  }
});
