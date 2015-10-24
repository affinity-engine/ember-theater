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
  emberTheaterStageManager: inject.service(),
  sceneRecordsCount: -1,

  abort() {
    this.set('isAborted', true);
  },

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');

    directionNames.forEach((name) => {
      const directionFactory = require(`${modulePrefix}/ember-theater/directions/${name}`)['default'];
      const stageManager = this.get('emberTheaterStageManager');

      this[Ember.String.camelize(name)] = (...directionArgs) => {
        return stageManager.handleDirection(this, directionFactory, name, directionArgs);
      };
    });
  }),

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
