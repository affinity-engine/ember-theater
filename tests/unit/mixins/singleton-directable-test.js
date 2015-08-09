import Ember from 'ember';
import SingletonDirectableMixin from '../../../mixins/singleton-directable';
import { module, test } from 'qunit';

module('Unit | Mixin | singleton directable');

// Replace this with your real tests.
test('it works', function(assert) {
  var SingletonDirectableObject = Ember.Object.extend(SingletonDirectableMixin);
  var subject = SingletonDirectableObject.create();
  assert.ok(subject);
});
