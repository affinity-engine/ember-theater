import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  classNames: ['ember-theater-stage'],
  layout: layout,
  
  characters: Ember.A([])
});
