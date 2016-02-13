import Ember from 'ember';
import config from 'dummy/ember-theater/config';
import backdrops from 'dummy/ember-theater/fixtures/backdrops';
import characters from 'dummy/ember-theater/fixtures/characters';
import expressions from 'dummy/ember-theater/fixtures/expressions';
import sounds from 'dummy/ember-theater/fixtures/sounds';

const { Controller } = Ember;

export default Controller.extend({
  config,
  fixtures: {
    backdrops,
    characters,
    expressions,
    sounds
  }
});
