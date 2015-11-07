import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],
  layout: layout,

  initializeComponents: on('didReceiveAttrs', function() {
    this.send('resetComponents');
  }),

  actions: {
    resetComponents() {
      const initialEmberTheaterComponents = this.get('initialEmberTheaterComponents');

      this.set('emberTheaterComponents', Ember.Object.create(initialEmberTheaterComponents));
    },

    startGame() {
      this.set('mediaIsLoaded', true);
    }
  }
});
