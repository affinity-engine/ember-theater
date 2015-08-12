import Ember from 'ember';
import PerfectScrollbarMixin from '../../../mixins/perfect-scrollbar';
import { module, test } from 'qunit';

module('Unit | Mixin | perfect scrollbar');

// Replace this with your real tests.
test('it works', function(assert) {
  var PerfectScrollbarObject = Ember.Object.extend(PerfectScrollbarMixin);
  var subject = PerfectScrollbarObject.create();
  assert.ok(subject);
});
