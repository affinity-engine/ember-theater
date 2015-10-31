import Ember from 'ember';
import { Layer } from 'ember-theater';

const {
  computed,
  inject,
  isBlank,
  isPresent,
  Service,
  RSVP
} = Ember;

const {
  Promise,
  resolve
} = RSVP;

export default Service.extend({
  directions: computed(() => Ember.A()),
  emberTheaterSceneManager: inject.service(),

  clearDirections() {
    this.get('directions').clear();
  },

  removeDirection(direction) {
    this.get('directions').removeObject(direction);
    direction.destroy();
  },

  findDirectionWithId(id, type) {
    if (isBlank(id)) { return; }

    return this.get('directions').find((direction) => {
      return direction.get('line.id') === id && direction.get('type') === type;
    });
  },

  handleDirection(scene, factory, name, args) {
    if (scene.get('isAborted')) { return resolve(); }

    let fastboot, fastbootResult;
    const sceneRecordsCount = scene.incrementProperty('sceneRecordsCount');

    if (scene.get('isLoading')) {
      const sceneRecord = scene.get('sceneRecord');
      fastbootResult = sceneRecord[sceneRecordsCount];

      if (fastbootResult !== undefined) {
        fastboot = true;
      } else {
        scene.set('isLoading', false);
      }
    }

    let directionPromise;
    const direction = factory.create({
      container: this.get('container'),
      fastboot,
      fastbootResult,
      type: name
    });

    if (isPresent(direction.perform)) {
      directionPromise = this._performMetaDirection(direction, ...args);
    } else {
      directionPromise = this._performDirectionOnStage(direction, name, ...args);
    }

    directionPromise.then((value) => {
      const sceneManager = this.get('emberTheaterSceneManager');
      sceneManager.updateSceneRecord(sceneRecordsCount, value);
    });

    return directionPromise;
  },

  _performMetaDirection(direction, ...directionArgs) {
    return new Promise((resolve) => {
      direction.perform(resolve, ...directionArgs);
    });
  },

  _performDirectionOnStage(direction, name, line) {
    const director = this.get('director');
    const activeDirection = this.findDirectionWithId(line.id, name);

    return new Promise((resolve) => {
      line.resolve = resolve;

      if (isBlank(activeDirection)) {
        direction.set('line', line);
        this._addDirection(direction);
      } else {
        activeDirection.set('line', line);
        direction.destroy();
      }
    });
  },

  _addDirection(direction) {
    this.get('directions').pushObject(direction);
  }
});
