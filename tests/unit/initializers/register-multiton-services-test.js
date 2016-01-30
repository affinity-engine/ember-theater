import Ember from 'ember';
import RegisterMultitonServicesInitializer from '../../../initializers/register-multiton-services';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register multiton services', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterMultitonServicesInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
