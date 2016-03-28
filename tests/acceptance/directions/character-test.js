import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';
import { getKeyCode } from 'ember-keyboard';

moduleForAcceptance('Acceptance | directions/character', {
  beforeEach() {
    Ember.testing = false;
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Ember Theater | Directions | character', function(assert) {
  assert.expect(16);

  const state = {};

  visit('/test-scenarios/directions/character').then(() => {
    return delay(150);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), '0.1', 'by default uses the config setting to `transition`');
    assert.equal(Ember.$(`${hook('expression-direction')} img`).attr('alt'), 'Bebe', '`alt` is set by the fixture `caption`');
    assert.ok(Ember.$(`${hook('expression-direction')} img`).attr('src').match('theater/characters/bebe/neutral.png'), 'it sets the `src` based on the associated fixture expression');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), 0.2, '`transition` sets character css');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal(parseFloat($hook('character-direction').css('opacity')).toFixed(1), 0.5, '`transition`s can be chained');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('character-direction').length, 2, 'multiple instances of the same character can be rendered by setting `instance`');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal(parseFloat(Ember.$(`${hook('character-direction')}:nth(0)`).css('opacity')).toFixed(1), 0.5, 'instances respond independently to `transition`s: 1');
    assert.equal(parseFloat(Ember.$(`${hook('character-direction')}:nth(1)`).css('opacity')).toFixed(1), 0.6, 'instances respond independently to `transition`s: 2');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('character-direction').length, 3, 'characters with different fixtures can co-exist on screen');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('character-direction').length, 4, '`character` can be passed a fixture directly');
    assert.ok(Ember.$(`${hook('expression-direction')}:nth(3) img`).attr('src').match('theater/characters/blixie/neutral.png'), 'the manually defined character defaultExpressionId is set properly');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal($hook('character-direction').length, 5, 'characters are rendered with `position`');
    assert.equal(Ember.$(`${hook('character-direction')}:nth(4)`).css('left'), '640px', '`position` positions the character');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(200);
  }).then(() => {
    const $bebe4 = Ember.$(`${hook('character-direction')}:nth(4)`);

    assert.equal($bebe4.css('left'), '256px', '`position` can accept multiple positions, Y');

    // phantom return -5%, while Chrome return -38.375px
    assert.ok(['-38.375px', '-5%'].indexOf($bebe4.css('bottom')) > -1, '`position` can accept multiple positions, X');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.ok(Ember.$(`${hook('expression-direction')}:nth(5) img`).attr('src').match('theater/characters/bebe/happy.png'), '`initialExpression` can adjust the initialExpression before rendering');

    Ember.$.Velocity.mock = false;

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  });
});
