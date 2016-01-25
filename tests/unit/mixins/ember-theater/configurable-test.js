import Ember from 'ember';
import EmberTheaterConfigurableMixin from '../../../mixins/ember-theater/configurable';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/configurable');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterConfigurableObject = Ember.Object.extend(EmberTheaterConfigurableMixin);
  let subject = EmberTheaterConfigurableObject.create();
  assert.ok(subject);
});
