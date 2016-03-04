import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('test-scenarios', function() {
    this.route('directions', function() {
      this.route('backdrop');
    });
  });
});

export default Router;
