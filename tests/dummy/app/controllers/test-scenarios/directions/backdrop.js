import Ember from 'ember';
import backdrops from 'dummy/ember-theater/fixtures/backdrops';

const { Controller } = Ember;

export default Controller.extend({
  config: {
    globals: {
      transition: {
        effect: { opacity: 0.1 },
        duration: 100
      }
    },
    director: {
      backdrop: {
        transition: {
          duration: 1000
        }
      }
    }
  },
  fixtures: {
    backdrops
  }
});
