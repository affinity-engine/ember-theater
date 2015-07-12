import { module, test } from 'qunit';
import Ember from 'ember';
import Backdrop from 'ember-theater/ember-theater-directions/backdrop';

module('ember-theater-direction:backdrop', 'Unit | Ember Theater Direction | backdrop', {
  // Specify the other units that are required for this test.
});

test('`perform` executes the current line', function(assert) {
  assert.expect(5);

  const backdrop = Backdrop;
  const sceneObjects = Ember.A([]);

  backdrop.reopen({
    store: {
      peekRecord(modelName, id) {
        const sceneObject = sceneObjects.find((sceneObject) => {
          return sceneObject.id === id;
        });
        if (!sceneObject) {
          return Ember.Object.create({
            id: id
          });
        }
        return sceneObject;
      } 
    }
  });

  let line = {
    id: 'first',
    initial: true
  };

  backdrop.perform(line, sceneObjects);
  assert.ok(sceneObjects.get('firstObject.line.initial'), 'adds the sceneObject');

  line = {
    id: 'first',
    initial: false
  };

  backdrop.perform(line, sceneObjects);
  assert.ok(!sceneObjects.get('firstObject.line.initial'), 'changes a sceneObject when present');

  line = {
    id: 'second'
  };

  backdrop.perform(line, sceneObjects);
  assert.deepEqual(sceneObjects.map((object) => { return object.id; }), ['first', 'second'], 'can add multiple objects');

  line = {
    id: 'second',
    destroy: true,
    resolve() {
      assert.ok(true, 'resolves the line after removing the sceneObject');
    }
  };

  backdrop.perform(line, sceneObjects);
  assert.deepEqual(sceneObjects.map((object) => { return object.id; }), ['first'], 'removes the object when destroy');
});
