import Ember from 'ember';
import DirectableComponentMixin from '../../../mixins/directable-component';
import { module, test } from 'qunit';

module('Unit | Mixin | directable component');

// Replace this with your real tests.
test('it works', function(assert) {
  var DirectableComponentObject = Ember.Object.extend(DirectableComponentMixin);
  var subject = DirectableComponentObject.create();
  assert.ok(subject);
});
