import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { run } = Ember;

const backdropClass = '.ember-theater-stage__backdrop';

moduleForComponent('ember-theater-director', 'Unit | Component | ember theater director', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: [
    'component:ember-theater-stage-backdrop', 
    'component:ember-theater-stage', 
    'model:ember-theater-backdrop'
  ]
});

test('`loadScene` triggers the `next` action', function(assert) {
  assert.expect(2);

  const component = this.subject({
    scene: 'foo',
    lineReader: Ember.Object.create({
      nextLine() {
        assert.ok(true, 'runs `next`');
        return { action: false };
      }
    })
  });

  component.loadScene();
  assert.equal(component.get('lineReader.scene'), 'foo', 'sets the lineReader.scene to this.scene');
});
