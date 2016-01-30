import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { Component } = Ember;
const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

const configurablePriority = ['config.attrs.menuBar', 'config.attrs.globals'];

export default Component.extend({
  layout,

  classNames: ['et-menu-bar-container'],
  classNameBindings: ['decorativeClassNames'],

  config: multitonService('ember-theater/config', 'theaterId'),

  components: reads('config.attrs.menuBar.components'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
