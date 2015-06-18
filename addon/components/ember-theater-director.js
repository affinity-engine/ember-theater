import Ember from 'ember';
import layout from '../templates/components/ember-theater-director';

const { Component, inject, observer, on } = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater__director'],
  store: inject.service('store'),

  loadScene: on('init', observer('scene', function() {
    const scene = this.get('scene');
    scene.set('director', this);
    scene.send('next');
  }))
});
