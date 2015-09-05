import Ember from 'ember';
import layout from './template';

const {
  Component,
  inject,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-save-menu-button'],
  layout: layout,
  tagName: 'button',
  session: inject.service(),

  loadGame: on('click', 'keyUp', 'touchEnd', function() {
    const save = this.get('save');
    this.get('session').loadGame(save);
    this.attrs.toScene(save.savePoints[0].sceneId);
  })
});
