import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-save-menu-button'],
  intlWrapper: inject.service(),
  layout: layout,
  tagName: 'button',
  session: inject.service(),

  loadGame: on('click', 'keyUp', 'touchEnd', function() {
    const save = this.get('save');
    this.get('session').loadGame(save);
    this.attrs.toScene(save.savePoints[0].sceneId);
  }),

  name: computed('save.name', function() {
    let name = this.get('save.name');

    if (name === 'autosave') {
      name = this.get('intlWrapper').formatMessage('emberTheaterSave.autosave');
    }

    return name;
  })
});
