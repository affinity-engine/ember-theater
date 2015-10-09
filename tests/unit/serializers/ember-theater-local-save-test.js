import { moduleForModel, test } from 'ember-qunit';

moduleForModel('ember-theater-local-save', 'Unit | Serializer | ember theater local save', {
  // Specify the other units that are required for this test.
  needs: ['serializer:ember-theater-local-save']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
