import Ember from 'ember';

const {
  K,
  computed,
  get,
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
        if (get(this, '_directions.firstObject') === object) {
          const promise = this._execute();
          const script = get(this, 'script');

          script._record(promise);

          set(this, 'executionComplete', promise);
        }

        resolve();
      });
    });

    set(this, 'allDirectionsAreLoaded', allDirectionsAreLoaded);
  },

  _execute() {
    const script = get(this, 'script');

    script._incrementSceneRecordIndex();

    const priorSceneRecord = script._getPriorSceneRecord();

    return new Promise((resolve) => {
      let resolveOrK = resolve;

      get(this, '_directions').forEach((direction) => {
        this._resolveDirection(direction, priorSceneRecord, resolveOrK);

        resolveOrK = K;
      });
    });
  },

  _resolveDirection(direction, priorSceneRecord, resolve) {
    direction._devertFromPromise();
    direction._perform(priorSceneRecord, resolve);
  }
});
