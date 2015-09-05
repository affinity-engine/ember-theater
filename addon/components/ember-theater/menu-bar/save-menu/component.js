import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject
} = Ember;
const { alias } = computed;

export default Component.extend({
  classNames: ['et-menu-bar-dropdown'],
  layout: layout,
  saves: alias('session.saves'),
  session: inject.service(),

  actions: {
    toScene(scene) {
      this.attrs.toScene(scene);
    }
  }
});
