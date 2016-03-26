import Ember from 'ember';

const {
  K,
  computed,
  get,
  getProperties,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;
const { run: { next } } = Ember;

export default Ember.Object.extend({
  _directions: computed(() => Ember.A()),

  contains(object) {
    return get(this, '_directions').contains(object);
  },

  removeObject(object) {
    return get(this, '_directions').removeObject(object);
  },

  unshiftObject(object) {
    return get(this, '_directions').unshiftObject(object);
  },

  startCountdown(object) {
    const allDirectionsAreLoaded = new Promise((resolve) => {
      next(() => {
        if (get(this, '_directions').indexOf(object) === 0) {
          const promise = this._execute();
          const script = get(this, 'script');

          script.record(promise);

          set(this, 'executionComplete', promise);
        }

        resolve();
      });
    });

    set(this, 'allDirectionsAreLoaded', allDirectionsAreLoaded);
  },

  _execute() {
    const script = get(this, 'script');

    script.incrementSceneRecordIndex();

    const priorSceneRecord = script.getPriorSceneRecord();

    return new Promise((resolve) => {
      get(this, '_directions').forEach((direction, index) => {
        this._resolveDirection(direction, index, priorSceneRecord, resolve);
      });
    });
  },

  _resolveDirection(direction, index, priorSceneRecord, resolve) {
    const resolveOrK = index === 0 ? resolve : K;

    direction._perform(priorSceneRecord, resolveOrK);
  },
})
