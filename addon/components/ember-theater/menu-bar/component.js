import Ember from 'ember';
import layout from './template';
import { configurableClassNames } from 'ember-theater/macros/ember-theater/director/configurable';

const { Component } = Ember;
const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

export default Component.extend({
  layout,

  classNames: ['et-menu-bar-container'],

  config: service('ember-theater/config'),

  components: reads('config.menuBar.components'),
  configurableClassNames: configurableClassNames('menuBar'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
