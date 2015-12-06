import Ember from 'ember';
import TransitionInMixin from '../../../mixins/transition-in';
import { module, test } from 'qunit';

module('Unit | Mixin | transition in');

// Replace this with your real tests.
test('it works', function(assert) {
  var TransitionInObject = Ember.Object.extend(TransitionInMixin);
  var subject = TransitionInObject.create();
  assert.ok(subject);
});
