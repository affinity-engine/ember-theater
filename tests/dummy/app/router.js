/* eslint-disable */

import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('ember-theater', function() {
    this.route('test-scenarios', function() {
      this.route('director', function() {
        this.route('directions', function() {
          this.route('backdrop');
          this.route('character');
        });
      });
    });
  });
});

export default Router;
