import { moduleForModel, test } from 'ember-qunit';

moduleForModel('ember-theater-character', 'Unit | Model | ember theater character', {
  // Specify the other units that are required for this test.
  needs: ['model:ember-theater-character-expression']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
