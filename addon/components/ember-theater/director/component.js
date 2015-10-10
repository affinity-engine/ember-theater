import Ember from 'ember';
import { Layer } from 'ember-theater';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';
import layout from './template';

const {
  Component,
  computed,
  get,
  inject,
  isEmpty,
  isPresent,
  observer,
  on,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Component.extend(ModulePrefixMixin, {
  classNames: ['et-director'],
  layout: layout,
  emberTheaterSceneManager: inject.service(),
  emberTheaterSaveStateManager: inject.service(),
  session: inject.service(),

  transitionToScene(sceneId, options) {
    this.get('emberTheaterSceneManager').toScene(sceneId, options);
  },

  _sceneChanged: observer('emberTheaterSceneManager.scene', function() {
    const sceneManager = this.get('emberTheaterSceneManager');
    const scene = sceneManager.get('scene');

    if (isPresent(scene)) {
      sceneManager.startSceneChange();
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
        this._resetTheaterLayer();
        Ember.$.Velocity.animate(this.element, { opacity: 1 }, { duration: 0 });
        sceneManager.endSceneChange();
        scene.script(this);
      });
    }
  }),

  _liftCurtains: on('didRender', function() {
    this.get('emberTheaterSceneManager').liftCurtains();
  }),

  _resetTheaterLayer() {
    const theaterLayer = Layer.create({
      directions: Ember.A(),
      layers: Ember.A(),
      name: 'theater'
    });

    this.set('theaterLayer', theaterLayer);

    return theaterLayer;
  },

  getStat(key) {
    return this.get('emberTheaterSaveStateManager').getStateValue(key);
  },

  setStat(key, value) {
    return this.get('emberTheaterSaveStateManager').setStateValue(key, value);
  },

  removeStat(key) {
    return this.get('emberTheaterSaveStateManager').deleteStateValue(key);
  },

  _defineDirections: on('init', function() {
    const modulePrefix = this.get('modulePrefix');
    const directionNames = this.get('_directionNames');
    this._resetTheaterLayer();

    directionNames.forEach((name) => {
      const directionFactory = require(`${modulePrefix}/ember-theater/directions/${name}`)['default'];

      this[name] = (line) => {
        let direction;
        const theaterLayer = this.get('theaterLayer'); 
        const directions = theaterLayer.gatherDirections();
        const isOnStage = isPresent(line.id) && directions.isAny('line.id', line.id);
        const createOrUpdate = isOnStage ? 'setProperties' : 'create';

        if (isOnStage) {
          direction = directions.find((direction) => {
            return direction.get('line.id') === line.id;
          });
        }

        return new Promise((resolve) => {
          line.resolve = resolve;

          const values = {
            container: this.get('container'),
            scene: this,
            line: line
          };

          if (isPresent(direction)) {
            direction = direction.setProperties(values);
          } else {
            direction = directionFactory.create(values);
          }

          if (direction.perform) {
            direction.perform();
            direction.destroy();
          } else if (!isOnStage) {
            theaterLayer.addDirection(direction);
          }
        });
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
