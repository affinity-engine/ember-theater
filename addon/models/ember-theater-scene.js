import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/ember-theater-module-prefix';

const {
  computed,
  on,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Ember.Object.extend(ModulePrefixMixin, {
  _defineDirections: on('init', function() {
    const modulePrefix = this.get('_modulePrefix');
    const directionNames = this.get('_directionNames');
    
    directionNames.forEach((name) => {
      const direction = require(`${modulePrefix}/ember-theater-directions/${name}`)['default'];
      direction.set('container', this.get('container'));

      this[name] = (line) => {
        return new Promise((resolve) =>  {
          line.resolve = resolve;
          direction.perform(line, this.get('sceneObjectContainers'));
        });
      };
    });
  }),

  _directionNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const modulePrefix = this.get('_modulePrefix');
      const regex = new RegExp(`${modulePrefix}\/ember-theater-directions\/(.*)`);

      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });
    }
  })
});
