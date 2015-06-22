import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const { run } = Ember;

let scene;

moduleFor('object:scene', 'Unit | Object | scene', {
  // Specify the other units that are required for this test.
  needs: ['model:ember-theater-backdrop'],
  beforeEach() {
    scene = this.subject({
      script: Ember.A([{
        backdrop: { id: 'beach' }
      }])
    });
  }
});

test('`_line` returns the current line', function(assert) {
  const line = {
    backdrop: { id: 'beach' }
  };
  assert.deepEqual(scene.get('_line'), line, 'returns current line');
});

test('`_lineKey` returns the current line key', function(assert) {
  assert.equal(scene.get('_lineKey'), 'backdrop', 'returns current line key');
});

test('`_lineValue` returns the current line value', function(assert) {
  assert.deepEqual(scene.get('_lineValue'), { id: 'beach' }, 'returns current line value');
});

test('`_nextLineExists` evaluates the presence of a following line', function(assert) {
  assert.ok(!scene.get('_nextLineExists'), 'returns false if there is no following line');
  scene.get('script').pushObject({ backdrop: { id: 'foo' } });
  assert.ok(scene.get('_nextLineExists'), 'returns true if there is a following line');
});

moduleFor('object:scene', 'Unit | Object | scene | actions', {
  // Specify the other units that are required for this test.
});

test('`next` triggers the current line and then increments the lineIndex', function(assert) {
  assert.expect(3);
  let lineIndex = 0;
  const done = assert.async();
  const expected = ['runs initial line', 'runs async lines', 'runs line after millisecond pause'];

  scene = this.subject({
    script: Ember.A([{
      mockAction: { actual: expected[0] }
    }, {
      mockAction: { actual: expected[1] }
    }, {
      mockAction: { actual: expected[2], pause: 10 }
    }, {
      mockAction: { actual: 'does not run if `pause` === true', pause: true }
    }]),
    director: {
      send(actionName, options) {
        this.actions[actionName](options);
      },
      actions: {
        mockAction(line) {
          assert.equal(line.actual, expected[lineIndex], line.actual);
          lineIndex += 1;
        }
      }
    }
  });

  scene.send('next');

  run.later(() => {
    done();
  }, 100);
});
