import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from '../../mixins/module-prefix';

const {
  Component,
  computed,
  on
} = Ember;

export default Component.extend(ModulePrefixMixin, {
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
