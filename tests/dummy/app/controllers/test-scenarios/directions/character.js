import Ember from 'ember';
import characters from 'dummy/ember-theater/fixtures/characters';
import expressions from 'dummy/ember-theater/fixtures/expressions';

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
      character: {
        transition: {
          duration: 1000
        }
      }
    }
  },
  fixtures: {
    characters,
    expressions
  }
});
