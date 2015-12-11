import Ember from 'ember';
import EmberTheaterDirectorAdjustableKeyboardMixin from '../../../mixins/ember-theater/director/adjustable-keyboard';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/director/adjustable keyboard');

// Replace this with your real tests.
test('it works', function(assert) {
  var EmberTheaterDirectorAdjustableKeyboardObject = Ember.Object.extend(EmberTheaterDirectorAdjustableKeyboardMixin);
  var subject = EmberTheaterDirectorAdjustableKeyboardObject.create();
  assert.ok(subject);
});
