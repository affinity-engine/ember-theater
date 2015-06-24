import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP, run } = Ember;

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
  assert.expect(8);
  let lineIndex = 0;
  const done = assert.async();

  scene = this.subject({
    script: Ember.A([{
      mockAction: { before: 0, after: 2  }
    }, {
      mockAction: { before: 1, after: 2, sync: true }
    }, {
      mockAction: { before: 2, after: 4  }
    }, {
      mockAction: { before: 3, after: 4  }
    }]),
    director: {
      send(actionName, options, resolve) {
        this.actions[actionName](options, resolve);
      },
      actions: {
        mockAction(line, resolve) {
          if (!line.sync) { resolve(); }
          assert.equal(line.before, lineIndex);
          lineIndex += 1;
          run.later(() => {
            assert.equal(line.after, lineIndex);
            if (line.sync) { resolve(); }
          }, 5);
        }
      }
    }
  });

  scene.send('next');

  run.later(() => {
    done();
  }, 30);
});
