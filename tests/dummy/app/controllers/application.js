import Ember from 'ember';
import config from 'dummy/ember-theater/config';
import backdrops from 'dummy/ember-theater/fixtures/backdrops';
import characterExpressions from 'dummy/ember-theater/fixtures/character-expressions';
import characters from 'dummy/ember-theater/fixtures/characters';
import sounds from 'dummy/ember-theater/fixtures/sounds';

const { Controller } = Ember;

export default Controller.extend({
  config,
  fixtures: {
    backdrops,
    characterExpressions,
    characters,
    sounds
  }
});
