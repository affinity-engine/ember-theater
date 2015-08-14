import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';

const {
  computed,
  inject,
  isEmpty,
  isPresent,
  on,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Ember.Object.extend(ModulePrefixMixin, {
  directables: Ember.A(),

  clearChannels(channels) {
    if (isEmpty(channels)) { return; }

    const directables = this.get('directables');

    channels.forEach((channel) => {
      directables.forEach((directable) => {
        const directableChannels = directable.get('channels');
        
        if (directableChannels && directableChannels.includes(channel)) {
          directables.removeObject(directable);
          directable.destroy();
        }
      });
    });
  },

  pushDirectable(directable) {
    this.get('directables').pushObject(directable);
  },

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');

    directionNames.forEach((name) => {
      let direction = require(`${modulePrefix}/ember-theater-directions/${name}`)['default'];

      this[name] = (line) => {
        const directables = this.get('directables');
        const isOnStage = isPresent(line.id) && directables.isAny('line.id', line.id);
        const createOrUpdate = isOnStage ? 'setProperties' : 'create';
        
        if (isOnStage) {
          direction = directables.find((directable) => {
            return directable.get('line.id') === line.id;
          });
        }

        return new Promise((resolve) => {
          line.resolve = resolve;

          direction[createOrUpdate]({
            container: this.get('container'),
            scene: this,
            line: line
          });
        });
      };
    });
  }),

  _directionNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const modulePrefix = this.get('modulePrefix');
      const regex = new RegExp(`${modulePrefix}\/ember-theater-directions\/(.*)`);

      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });
    }
  })
});
