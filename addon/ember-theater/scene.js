import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';

const {
  computed,
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

        const direction = directionFactory.create({
          container: this.get('container'),
          type: name
        });

        if (isPresent(direction.perform)) {
          return this._performMetaDirection(direction, ...directionArgs);
        } else {
          return this._performDirectionOnStage(direction, name, ...directionArgs);
        }
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
