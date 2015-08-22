import Ember from 'ember';
import EmberTheaterLayer from 'ember-theater/models/ember-theater-layer';
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
  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');
    const theaterLayer = EmberTheaterLayer.create({
      name: 'theater'
    });

    this.set('theaterLayer', theaterLayer);

    directionNames.forEach((name) => {
      let direction = require(`${modulePrefix}/ember-theater-directions/${name}`)['default'];

      this[name] = (line) => {
        const directables = theaterLayer.gatherDirectables();
        const isOnStage = isPresent(line.id) && directables.isAny('line.id', line.id);
        const createOrUpdate = isOnStage ? 'setProperties' : 'create';

        if (isOnStage) {
          direction = directables.find((directable) => {
            return directable.get('line.id') === line.id;
          });
        }

        return new Promise((resolve) => {
          line.resolve = resolve;

          const directable = direction[createOrUpdate]({
            container: this.get('container'),
            scene: this,
            line: line
          });

          if (directable.perform) {
            directable.perform();
            directable.destroy();
            return;
          }

          if (!isOnStage) {
            theaterLayer.addDirectable(directable)
          }

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
  }).readOnly()
});
