import Ember from 'ember';

const {
  Controller,
  inject,
  on
} = Ember;

export default Controller.extend({
  emberTheaterSceneManager: inject.service(),
  initialEmberTheaterComponents: {
    'ember-theater/menu-bar': Ember.A([
      'ember-theater/menu-bar/load',
      'ember-theater/menu-bar/save',
      'ember-theater/menu-bar/reset'
    ]),
    'ember-theater/director': []
  },

  setInitialScene: on('init', function() {
    this.set('emberTheaterSceneManager.sceneId', 1);
  })
});
