import Ember from 'ember';
import EmberTheaterBusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/bus publisher');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterBusPublisherObject = Ember.Object.extend(EmberTheaterBusPublisherMixin);
  let subject = EmberTheaterBusPublisherObject.create();
  assert.ok(subject);
});
