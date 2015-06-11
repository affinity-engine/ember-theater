import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

const backgroundClass = '.theater-stage__background';
const backgroundToggleId = '#toggle_background';

let application;

module('Acceptance | background', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('changing background images', (assert) => {
  visit('/');

  andThen(() => {
    assert.equal(
      Ember.$(backgroundClass).css('background-image'),
      'url(http://localhost:7357/images/background-beach--day.jpg)',
      'renders initial background'
    );
  });

  click(backgroundToggleId);

  andThen(() => {
    assert.equal(
      Ember.$(backgroundClass).css('background-image'),
      'url(http://localhost:7357/images/background-beach--night.jpg)',
      'changes the background'
    );
  });
});
