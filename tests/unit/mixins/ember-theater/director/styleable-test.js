import Ember from 'ember';
import EmberTheaterDirectorStyleableMixin from '../../../mixins/ember-theater/director/styleable';
import { module, test } from 'qunit';

module('Unit | Mixin | ember theater/director/styleable');

// Replace this with your real tests.
test('it works', function(assert) {
  var EmberTheaterDirectorStyleableObject = Ember.Object.extend(EmberTheaterDirectorStyleableMixin);
  var subject = EmberTheaterDirectorStyleableObject.create();
  assert.ok(subject);
});
