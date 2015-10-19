import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';

const {
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  on,
  RSVP
} = Ember;

const {
  Promise,
  resolve
} = RSVP;

export default Ember.Object.extend(ModulePrefixMixin, {
  emberTheaterSceneManager: inject.service(),
  sceneRecordsCount: -1,

  abort() {
    this.set('isAborted', true);
  },

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');

    directionNames.forEach((name) => {
      const directionFactory = require(`${modulePrefix}/ember-theater/directions/${name}`)['default'];

      this[Ember.String.camelize(name)] = (...directionArgs) => {
        if (this.get('isAborted')) { return resolve(); }
        
        let fastboot, fastbootResult;
        const sceneRecordsCount = this.incrementProperty('sceneRecordsCount');

        if (this.get('isLoading')) {
          const sceneRecord = this.get('sceneRecord');
          fastbootResult = sceneRecord[sceneRecordsCount];

          if (fastbootResult !== undefined) {
            fastboot = true;
          } else {
            this.toggleProperty('isLoading');
          }
        }

        let directionPromise;
        const direction = directionFactory.create({
          container: this.get('container'),
          fastboot,
          fastbootResult,
          type: name
        });

        if (isPresent(direction.perform)) {
          directionPromise = this._performMetaDirection(direction, ...directionArgs);
        } else {
          directionPromise = this._performDirectionOnStage(direction, name, ...directionArgs);
        }

        directionPromise.then((value) => {
          const sceneManager = this.get('emberTheaterSceneManager');
          sceneManager.updateSceneRecord(sceneRecordsCount, value);
        });

        return directionPromise;
      };
    });
  }),

  _performMetaDirection(direction, ...directionArgs) {
    return new Promise((resolve) => {
      direction.perform(resolve, ...directionArgs);
    });
  },

  _performDirectionOnStage(direction, name, line) {
    const director = this.get('director');
    const activeDirection = director.findDirectionWithId(line.id, name);

    return new Promise((resolve) => {
      line.resolve = resolve;

      if (isBlank(activeDirection)) {
        direction.set('line', line);
        director.addDirection(direction);
      } else {
        activeDirection.set('line', line);
        direction.destroy();
      }
    });
  },

  _directionNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const modulePrefix = this.get('modulePrefix');
      const regex = new RegExp(`${modulePrefix}\/ember-theater/directions\/(.*)`);

      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });
    }
  }).readOnly()
});
