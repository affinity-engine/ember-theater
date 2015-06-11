import Ember from 'ember';
import layout from '../templates/components/theater-stage';

const { Component } = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['theater-stage'],
  
  characters: Ember.A([])
});
