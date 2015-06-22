import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('ember-theater-director', 'Unit | Component | ember theater director', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: ['component:ember-theater-stage', 'component:ember-theater-stage-backdrop']
});

test('`_loadScene` triggers the `next` action on its scene', function(assert) {
  assert.expect(2);
  
  const Scene = Ember.Object.extend({
    send(action) {
      assert.equal(action, 'next', 'sends the `next` when scene changes');
    }
  });

  const component = this.subject();
  component.set('scene', Scene.create());
  assert.deepEqual(component.get('scene.director'), component, 'sets the scene director to `this`');
});
