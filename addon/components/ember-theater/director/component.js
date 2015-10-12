import Ember from 'ember';
import { Layer } from 'ember-theater';
import layout from './template';

const {
  Component,
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  observer,
  on,
  RSVP
} = Ember;

const {
  Promise,
  resolve
} = RSVP;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,
  emberTheaterSceneManager: inject.service(),
  emberTheaterSaveStateManager: inject.service(),
  session: inject.service(),

  addDirection(direction) {
    this.get('theaterLayer').addDirection(direction);
  },

  findDirectionWithId(id) {
    if (isBlank(id)) { return; }

    const theaterLayer = this.get('theaterLayer'); 
    const directions = theaterLayer.gatherDirections();

    return directions.find((direction) => {
      return direction.get('line.id') === id;
    });
  },

  _sceneChanged: observer('emberTheaterSceneManager.scene', function() {
    const scene = this.get('emberTheaterSceneManager.scene');

    if (isPresent(scene)) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
        this._resetTheaterLayer();
        Ember.$.Velocity.animate(this.element, { opacity: 1 }, { duration: 0 });
        scene.set('director', this);
        scene.script();
      });
    }
  }),

  _liftCurtains: on('didRender', function() {
    this.get('emberTheaterSceneManager').liftCurtains();
  }),

  _resetTheaterLayer: on('init', function() {
    const theaterLayer = Layer.create({
      directions: Ember.A(),
      layers: Ember.A(),
      name: 'theater'
    });

    this.set('theaterLayer', theaterLayer);
  })
});
