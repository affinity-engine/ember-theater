import Ember from 'ember';
import EmberTheaterTheaterIdMixin from '../../../mixins/ember-theater/theater-id';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/theater id');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterTheaterIdObject = Ember.Object.extend(EmberTheaterTheaterIdMixin);
  let subject = EmberTheaterTheaterIdObject.create();
  assert.ok(subject);
});
