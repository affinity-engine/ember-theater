import Ember from 'ember';
import JsonSerializerNormalizePatchMixin from '../../../mixins/json-serializer-normalize-patch';
import { module, test } from 'qunit';

module('Unit | Mixin | json serializer normalize patch');

// Replace this with your real tests.
test('it works', function(assert) {
  var JsonSerializerNormalizePatchObject = Ember.Object.extend(JsonSerializerNormalizePatchMixin);
  var subject = JsonSerializerNormalizePatchObject.create();
  assert.ok(subject);
});
