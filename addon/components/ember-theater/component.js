import Ember from 'ember';
import layout from './template';

const {
  Component,
  set
} = Ember;

const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

export default Component.extend({
  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],
  layout: layout,

  producer: service('ember-theater/producer'),

  components: reads('producer.components'),

  actions: {
    startGame() {
      set(this, 'mediaIsLoaded', true);
    }
  }
});
