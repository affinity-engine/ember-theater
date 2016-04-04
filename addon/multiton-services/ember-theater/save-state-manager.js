import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import nativeCopy from 'ember-theater/utils/ember-theater/native-copy';

const {
  computed,
  get,
  getProperties,
  isPresent,
  merge,
  on,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, MultitonIdsMixin, {
  version: '1.1.0',

  store: service(),

  activeState: computed(() => Ember.Object.create()),
  statePoints: computed(() => Ember.A()),

  mostRecentSave: computed({
    get: async function() {
      const saves = await get(this, 'saves');

      return saves.sortBy('updated').reverseObjects().get('firstObject');
    }
  }).volatile(),

  saves: computed({
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').query('ember-theater/local-save', {
        theaterId
      });
    }
  }).readOnly().volatile(),

  // RECORD MANAGEMENT //
  createRecord: on('et:main:saveIsCreating', async function(name, options) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    const record = get(this, 'store').createRecord('ember-theater/local-save', {
      name,
      statePoints,
      theaterId,
      version,
      ...options
    });

    return await record.save();
  }),

  updateRecord: on('et:main:saveIsUpdating', async function(record, options) {
    const theaterId = get(this, 'theaterId');
    const version = get(this, 'version');
    const statePoints = this._getCurrentStatePoints();

    setProperties(record, {
      statePoints,
      theaterId,
      version,
      ...options
    });

    return await record.save();
  }),

  _getCurrentStatePoints() {
    const statePoints = nativeCopy(get(this, 'statePoints'));
    const activeState = nativeCopy(get(this, 'activeState'));

    merge(statePoints[statePoints.length - 1], activeState);

    return statePoints;
  },

  deleteRecord: on('et:main:saveIsDestroying', async function(record) {
    return await record.destroyRecord();
  }),

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
  appendActiveState:  on('et:main:appendingActiveState', function(optionalValues) {
    const activeState = nativeCopy(get(this, 'activeState'));
    const mergedState = merge(activeState, optionalValues);

    get(this, 'statePoints').pushObject(mergedState);
    set(this, 'activeState', activeState);
  }),

  loadStatePoint: on('et:main:gameIsRewinding', function(statePoints) {
    const activeState = get(statePoints, 'lastObject');

    setProperties(this, { activeState, statePoints });
  }),

  getStateValue(key) {
    return get(this, `activeState.${key}`);
  },

  setStateValue: on('et:main:settingStateValue', function(key, value) {
    return set(this, `activeState.${key}`, value);
  }),

  decrementStateValue: on('et:main:decrementingStateValue', function(key, amount) {
    return this.decrementProperty(`activeState.${key}`, amount);
  }),

  incrementStateValue: on('et:main:incrementingStateValue', function(key, amount) {
    return this.incrementProperty(`activeState.${key}`, amount);
  }),

  toggleStateValue: on('et:main:togglingStateValue', function(key) {
    return this.toggleProperty(`activeState.${key}`);
  }),

  deleteStateValue: on('et:main:deletingStateValue', function(key) {
    return this.setStateValue(key, undefined);
  })
});
