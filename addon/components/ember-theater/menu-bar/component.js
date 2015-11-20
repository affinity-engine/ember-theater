import Ember from 'ember';
import layout from './template';

const { Component } = Ember;
const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-container'],
  layout: layout,

  producer: service('ember-theater/producer'),

  components: reads('producer.emberTheaterMenuBar'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
