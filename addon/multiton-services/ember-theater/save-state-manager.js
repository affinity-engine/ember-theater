import Ember from 'ember';
import nativeCopy from 'ember-theater/utils/ember-theater/native-copy';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  Service,
  computed,
  get,
  getProperties,
  isPresent,
  merge,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  version: '1.1.0',

  store: service(),

  activeState: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),

  getMostRecentSave: async function() {
    await this._ensureAutosave();

    const saves = await get(this, 'saves');

    return saves.sortBy('updated').reverseObjects().get('firstObject');
  },

  autosave: computed({
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').queryRecord('ember-theater/local-save', {
        isAutosave: true,
        theaterId
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
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').query('ember-theater/local-save', {
        theaterId
      });
    }
  }).readOnly(),

  resetAutosave: async function() {
    const autosave = await get(this, 'autosave');

    set(this, 'activeState', Ember.Object.create());
    get(this, 'statePoints').clear();

    this.updateRecord(autosave);
  },

  // RECORD MANAGEMENT //
  createRecord: async function(name) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    const record = get(this, 'store').createRecord('ember-theater/local-save', {
      name,
      statePoints,
      theaterId,
      version
    });

    return await record.save();
  },

  updateRecord: async function(record) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    setProperties(record, {
      statePoints,
      theaterId,
      version
    });

    return await record.save();
  },

  _getCurrentStatePoints() {
    const statePoints = nativeCopy(get(this, 'statePoints'));
    const activeState = nativeCopy(get(this, 'activeState'));

    merge(statePoints[statePoints.length - 1], activeState);

    return statePoints;
  },

  deleteRecord: async function(record) {
    return await record.destroyRecord();
  },

  loadRecord(record) {
    record.reload();

    const {
      activeState,
      statePoints
    } = getProperties(record, 'activeState', 'statePoints');

    setProperties(this, {
      activeState: nativeCopy(activeState),
      statePoints: Ember.A(nativeCopy(statePoints))
    });
  },

  // STATE MANAGEMENT //
  appendActiveState(optionalValues) {
    const activeState = nativeCopy(get(this, 'activeState'));
    const mergedState = merge(activeState, optionalValues);

    get(this, 'statePoints').pushObject(mergedState);
    set(this, 'activeState', activeState);
  },

  loadStatePoint(statePoints) {
    const activeState = get(statePoints, 'lastObject');

    setProperties(this, { activeState, statePoints });
  },

  deleteStateValue(key) {
    return this.setStateValue(key, null);
  },

  getStateValue(key) {
    return get(this, `activeState.${key}`);
  },

  setStateValue(key, value) {
    return set(this, `activeState.${key}`, value);
  }
});
