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
  layers: Ember.A(),

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');

    directionNames.forEach((name) => {
      let direction = require(`${modulePrefix}/ember-theater-directions/${name}`)['default'];

      this[name] = (line) => {
        const layers = this.get('layers');
        const directables = layers.reduce((directables, layer) => {
          return directables.pushObjects(layer.get('directables'));
        }, Ember.A());
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

          if (!isOnStage) {
            const layer = layers.find((layer) => {
              return layer.get('name') === directable.get('layer');
            });

            if (layer) {
              if (directable.get('singletonLayer')) {
                layer.get('directables').clear();
              }

              layer.get('directables').pushObject(directable);
            } else {
              layers.pushObject(Ember.Object.create({
                name: directable.get('layer'),
                directables: Ember.A([directable])
              }));
            }
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
  })
});
