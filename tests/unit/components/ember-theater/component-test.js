import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-theater', 'Unit | Component | ember theater', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('`transitionToScene` sets the current scene', function(assert) {
  const scene = require('dummy/ember-theater-scenes/2')['default'];

  const component = this.subject({
    _modulePrefix: 'dummy'
  });
  component.send('transitionToScene', '2');
  assert.deepEqual(component.get('scene'), scene, 'sets the scene');
  assert.deepEqual(component.get('scene.container'), component.container, 'sets the scene container');
});

test('`transitionToInitialScene` transitions to the `initialScene`', function(assert) {
  const scene = require('dummy/ember-theater-scenes/2')['default'];

  const component = this.subject({
    initialScene: '2',
    _modulePrefix: 'dummy'
  });
  component.send('transitionToInitialScene');
  assert.deepEqual(component.get('scene'), scene, 'sets the scene');
  assert.deepEqual(component.get('scene.container'), component.container, 'sets the scene container');
});
