import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';
import { getKeyCode } from 'ember-keyboard';

moduleForAcceptance('Acceptance | directions/backdrop', {
  beforeEach() {
    Ember.testing = false;
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Ember Theater | Directions | Backdrop', function(assert) {
  assert.expect(13);

  const state = {};

  visit('/test-scenarios/directions/backdrop').then(() => {
    return delay(150);
  }).then(() => {
    assert.ok($hook('backdrop-direction').length > 0, 'backdrop is rendered');
    assert.equal(parseFloat($hook('backdrop-direction').css('opacity')).toFixed(1), '0.1', 'by default uses the config setting to `transition`');
    assert.equal(Ember.$(`${hook('backdrop-direction')} img`).attr('alt'), 'Classroom', '`alt` is set by the fixture `caption`');
    assert.ok(Ember.$(`${hook('backdrop-direction')} img`).attr('src').match('theater/backdrops/classroom.png'), 'it sets the `src` based on the associated fixture');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal(parseFloat($hook('backdrop-direction').css('opacity')).toFixed(1), 0.2, '`transition` sets backdrop css');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  }).then(() => {
    assert.equal(parseFloat($hook('backdrop-direction').css('opacity')).toFixed(1), 0.5, '`transition`s can be chained');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal(Ember.$(`${hook('backdrop-direction')} img`).attr('alt'), 'foo', '`alt` can be set by direction function `caption`');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('backdrop-direction').length, 2, 'multiple instances of the same backdrop can be rendered by setting `instance`');

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(300);
  }).then(() => {
    assert.equal(parseFloat(Ember.$(`${hook('backdrop-direction')}:first`).css('opacity')).toFixed(1), 0.5, 'instances respond independently to `transition`s: 1');
    assert.equal(parseFloat(Ember.$(`${hook('backdrop-direction')}:nth(1)`).css('opacity')).toFixed(1), 0.6, 'instances respond independently to `transition`s: 2');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('backdrop-direction').length, 3, 'backdrops with different fixtures can co-exist on screen');

    return keyEvent(document, 'keyup', getKeyCode('p'));
  }).then(() => {
    assert.equal($hook('backdrop-direction').length, 4, '`Backdrop` can be passed a fixture directly');
    assert.ok(Ember.$(`${hook('backdrop-direction')}:nth(3) img`).attr('src').match('theater/backdrops/beach-night.jpg'), 'the manually defined backdrop src is set properly');

    Ember.$.Velocity.mock = false;

    keyEvent(document, 'keyup', getKeyCode('p'));

    return delay(100);
  });
});
