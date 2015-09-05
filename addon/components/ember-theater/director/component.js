import Ember from 'ember';
import EmberTheaterLayer from 'ember-theater/models/ember-theater-layer';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';
import layout from './template';

const {
  Component,
  computed,
  inject,
  isPresent,
  on,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Component.extend(ModulePrefixMixin, {
  classNames: ['et-director'],
  layout: layout,
  session: inject.service(),

  loadScene: on('didRender', function() {
    const scene = this.get('scene');

    this.set('sceneId', scene.get('id'));
    scene.script(this);
  }),

  transitionToScene(sceneId, options) {
    Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
      this.attrs.toScene(sceneId, options);
      this._resetTheaterLayer();
      Ember.$.Velocity.animate(this.element, { opacity: 1 }, { duration: 0 });
    });
  },

  getStat(key) {
    return this.get('session').getCurrentSessionItem(key);
  },

  setStat(key, value) {
    this.get('session').setCurrentSessionItem(key, value);
  },

  removeStat(key) {
    this.get('session').removeCurrentSessionItem(key);
  },

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');
    this._resetTheaterLayer();

    directionNames.forEach((name) => {
      let direction = require(`${modulePrefix}/ember-theater-directions/${name}`)['default'];

      this[name] = (line) => {
        const theaterLayer = this.get('theaterLayer'); 
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
          } else if (!isOnStage) {
            theaterLayer.addDirectable(directable);
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
  }).readOnly(),

  _resetTheaterLayer() {
    const theaterLayer = EmberTheaterLayer.create({
      directables: Ember.A(),
      layers: Ember.A(),
      name: 'theater'
    });

    this.set('theaterLayer', theaterLayer);

    return theaterLayer;
  }
});
