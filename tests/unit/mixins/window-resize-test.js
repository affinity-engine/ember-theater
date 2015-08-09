import Ember from 'ember';
import WindowResizeMixin from '../../../mixins/window-resize';
import { module, test } from 'qunit';

module('Unit | Mixin | window resize');

// Replace this with your real tests.
test('it works', function(assert) {
  var WindowResizeObject = Ember.Object.extend(WindowResizeMixin);
  var subject = WindowResizeObject.create();
  assert.ok(subject);
});
