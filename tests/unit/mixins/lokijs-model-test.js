import Ember from 'ember';
import LokijsModelMixin from '../../../mixins/lokijs-model';
import { module, test } from 'qunit';

module('Unit | Mixin | lokijs model');

// Replace this with your real tests.
test('it works', function(assert) {
  var LokijsModelObject = Ember.Object.extend(LokijsModelMixin);
  var subject = LokijsModelObject.create();
  assert.ok(subject);
});
