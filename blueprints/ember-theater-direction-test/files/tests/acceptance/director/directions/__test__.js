import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | ember-theater/director/directions/<%= dasherizedModuleName %>', {
  beforeEach() {
    Ember.testing = false;
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Ember Theater | Director | Directions | <%= classifiedModuleName %>', function(assert) {
  visit('/ember-theater/test-scenarios/director/directions/<%= dasherizedModuleName %>');
});
