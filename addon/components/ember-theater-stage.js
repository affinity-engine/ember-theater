import Ember from 'ember';
import layout from '../templates/components/ember-theater-stage';

const { Component } = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater-stage'],
  
  characters: Ember.A([])
});
