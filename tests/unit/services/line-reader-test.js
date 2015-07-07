import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP, run } = Ember;

let lineReader;

moduleFor('service:line-reader', 'Unit | Service | line reader', {
  // Specify the other units that are required for this test.
  needs: ['model:ember-theater-backdrop'],
  beforeEach() {
    lineReader = this.subject({
      _lineIndex: 0,
      scene: Ember.Object.create({
        script: Ember.A([{
          backdrop: { id: 'beach' }
        }])
      })
    });
  }
});

test('`_line` returns the current line', function(assert) {
  const line = {
    backdrop: { id: 'beach' }
  };
  assert.deepEqual(lineReader.get('_line'), line, 'returns current line');
});

test('`_lineKey` returns the current line key', function(assert) {
  assert.equal(lineReader.get('_lineKey'), 'backdrop', 'returns current line key');
});

test('`_lineValue` returns the current line value', function(assert) {
  assert.deepEqual(lineReader.get('_lineValue'), { id: 'beach' }, 'returns current line value');
});

test('`_nextLineExists` evaluates the presence of a following line', function(assert) {
  assert.ok(!lineReader.get('_nextLineExists'), 'returns false if there is no following line');
  lineReader.get('scene.script').pushObject({ backdrop: { id: 'foo' } });
  assert.ok(lineReader.get('_nextLineExists'), 'returns true if there is a following line');
});

test('`nextLine` returns the next action/line or false', function(assert) {
  lineReader.set('_lineIndex', -1);
  assert.deepEqual(lineReader.nextLine(), { action: 'backdrop', line: { id: 'beach' } },
    'returns the action/line');
  assert.equal(lineReader.get('_lineIndex'), 0, 'increments the `_lineIndex`');
  assert.deepEqual(lineReader.nextLine(), { action: false },
    'returns { action: false } when there are no more actions');
});

