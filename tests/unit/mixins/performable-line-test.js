import Ember from 'ember';
import PerformableLineMixin from '../../../mixins/performable-line';
import { module, test } from 'qunit';

module('Unit | Mixin | performable line');

// Replace this with your real tests.
test('it works', function(assert) {
  var PerformableLineObject = Ember.Object.extend(PerformableLineMixin);
  var subject = PerformableLineObject.create();
  assert.ok(subject);
});
