import Ember from 'ember';
import { initialize } from '../../../initializers/theater-fixtures';
import { module, test } from 'qunit';
import startApp from '../../../tests/helpers/start-app';

let container, application;

module('Unit | Initializer | theater fixtures', {
  beforeEach() {
    application = startApp();
    container = application.__container__;
  },

  afterEach() {
    Ember.run(() => {
      application.destroy();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
