import { module, test } from 'qunit';
import Ember from 'ember';
import Character from 'ember-theater/ember-theater-directions/character';

module('ember-theater-direction:character', 'Unit | Ember Theater Direction | character', {
  // Specify the other units that are required for this test.
});

test('`perform` executes the current line', function(assert) {
  assert.expect(5);

  const character = Character;
  const sceneObjects = Ember.A([]);

  character.reopen({
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

  character.perform(line, sceneObjects);
  assert.ok(sceneObjects.get('firstObject.line.initial'), 'adds the sceneObject');

  line = {
    id: 'first',
    initial: false
  };

  character.perform(line, sceneObjects);
  assert.ok(!sceneObjects.get('firstObject.line.initial'), 'changes a sceneObject when present');

  line = {
    id: 'second'
  };

  character.perform(line, sceneObjects);

  let actual = sceneObjects.map((object) => {
    return object.id;
  });

  assert.deepEqual(actual, ['first', 'second'], 'can add multiple objects');

  line = {
    id: 'second',
    destroy: true,
    resolve() {
      assert.ok(true, 'resolves the line after removing the sceneObject');
    }
  };

  character.perform(line, sceneObjects);

  actual = sceneObjects.map((object) => {
    return object.id;
  });

  assert.deepEqual(actual, ['first'], 'removes the object when destroy');
});
