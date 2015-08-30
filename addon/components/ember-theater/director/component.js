import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  observer
} = Ember;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,

  loadScene: observer('scene.id', function() {
    this.get('scene').script();
  })
});
