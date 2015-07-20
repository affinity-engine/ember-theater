import { moduleForModel, test } from 'ember-qunit';

moduleForModel('ember-theater-character-expression', 'Unit | Model | ember theater character expression', {
  // Specify the other units that are required for this test.
  needs: ['model:ember-theater-character']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
