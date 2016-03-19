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
          set(this, 'executionComplete', this._execute());
        }

        resolve();
      });
    });

    set(this, 'allDirectionsAreLoaded', allDirectionsAreLoaded);
  },

  _execute() {
    const {
      _directions,
      script,
      sceneManager
    } = getProperties(this, '_directions', 'script', 'sceneManager');

    const meta = getProperties(this, 'autoResolve', 'autoResolveResult');

    const promise = new Promise((resolve) => {
      _directions.forEach((direction, index) => {
        this._resolveDirection(direction, index, meta, resolve);
      });
    });

    sceneManager.recordSceneRecordEvent(promise, script);

    return promise;
  },

  _resolveDirection(direction, index, meta, resolve) {
    const resolveOrK = index === 0 ? resolve : K;

    direction._perform(meta, resolveOrK);
  },
})
