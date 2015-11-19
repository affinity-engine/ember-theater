import { moduleFor, test } from 'ember-qunit';

moduleFor('service:ember-theater/scene-recorder', 'Unit | Service | ember theater/scene recorder', {
  // Specify the other units that are required for this test.
  needs: ['service:ember-theater/save-state-manager', 'service:ember-theater/scene-manager']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();

  assert.ok(service);
});
