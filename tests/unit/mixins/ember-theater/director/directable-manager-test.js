import Ember from 'ember';
import EmberTheaterDirectorDirectableManagerMixin from 'ember-theater/mixins/ember-theater/director/directable-manager';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/director/directable manager');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmberTheaterDirectorDirectableManagerObject = Ember.Object.extend(EmberTheaterDirectorDirectableManagerMixin);
  let subject = EmberTheaterDirectorDirectableManagerObject.create();
  assert.ok(subject);
});
