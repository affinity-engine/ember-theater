import Ember from 'ember';
import EmberTheaterMultiServiceMixin from '../../../mixins/ember-theater/multi-service';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/multi service');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterMultiServiceObject = Ember.Object.extend(EmberTheaterMultiServiceMixin);
  let subject = EmberTheaterMultiServiceObject.create();
  assert.ok(subject);
});
