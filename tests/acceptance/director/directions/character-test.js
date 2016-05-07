import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';

moduleForAcceptance('Acceptance | ember-theater/director/directions/character', {
  beforeEach() {
    Ember.testing = false;
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Ember Theater | Director | Directions | character', function(assert) {
  assert.expect(18);

  visit('/ember-theater/test-scenarios/director/directions/character').then(() => {
    return delay(150);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), '0.1', 'by default uses the config setting to `transition`');
    assert.equal(Ember.$(`${hook('expression-direction')} img`).attr('alt'), 'Bitsy', '`alt` is set by the fixture `caption`');
    assert.ok(Ember.$(`${hook('expression-direction')} img`).attr('src').match('theater/characters/bitsy/neutral.png'), 'it sets the `src` based on the associated fixture expression');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), 0.2, '`transition` sets character css');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), 0.5, '`transition`s can be chained');

    return step();
  }).then(() => {
    assert.equal($hook('character-direction').length, 2, 'multiple instances of the same character can be rendered by setting `instance`');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat(Ember.$(`${hook('character-direction')}:nth(0)`).css('opacity')).toFixed(1), 0.5, 'instances respond independently to `transition`s: 1');
    assert.equal(parseFloat(Ember.$(`${hook('character-direction')}:nth(1)`).css('opacity')).toFixed(1), 0.6, 'instances respond independently to `transition`s: 2');

    return step();
  }).then(() => {
    assert.equal($hook('character-direction').length, 3, 'characters with different fixtures can co-exist on screen');

    return step();
  }).then(() => {
    assert.equal($hook('character-direction').length, 4, '`character` can be passed a fixture directly');
    assert.ok(Ember.$(`${hook('expression-direction')}:nth(3) img`).attr('src').match('theater/characters/emma/neutral.png'), 'the manually defined character defaultExpressionId is set properly');

    return step(100);
  }).then(() => {
    assert.equal($hook('character-direction').length, 5, 'characters are rendered with `position`');
    assert.equal(Ember.$(`${hook('character-direction')}:nth(4)`).css('left'), '640px', '`position` positions the character');

    return step(200);
  }).then(() => {
    const $bitsy4 = Ember.$(`${hook('character-direction')}:nth(4)`);

    assert.equal($bitsy4.css('left'), '256px', '`position` can accept multiple positions, Y');

    // phantom return -5%, while Chrome return -38.375px
    assert.ok(['-38.375px', '-5%'].indexOf($bitsy4.css('bottom')) > -1, '`position` can accept multiple positions, X');

    return step();
  }).then(() => {
    assert.ok(Ember.$(`${hook('expression-direction')}:nth(5) img`).attr('src').match('theater/characters/bitsy/happy.png'), '`expression` can adjust the expression before rendering');

    return step(100);
  }).then(() => {
    assert.ok(Ember.$(`${hook('expression-direction')}:nth(5) img`).attr('src').match('theater/characters/bitsy/sad.png'), '`expression` can adjust the expression after rendering');
    assert.equal(Ember.$(`${hook('character-direction')}:nth(5)`).css('left'), '1024px', '`position` can be chained after expression');
  });
});
