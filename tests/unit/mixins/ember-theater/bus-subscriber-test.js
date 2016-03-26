import Ember from 'ember';
import EmberTheaterBusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/bus subscriber');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterBusSubscriberObject = Ember.Object.extend(EmberTheaterBusSubscriberMixin);
  let subject = EmberTheaterBusSubscriberObject.create();
  assert.ok(subject);
});
