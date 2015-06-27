import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { run } = Ember;

const backdropClass = '.ember-theater-stage__backdrop';

moduleForComponent('ember-theater-director', 'Unit | Component | ember theater director', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: ['component:ember-theater-stage', 'component:ember-theater-stage-backdrop', 
    'model:ember-theater-backdrop']
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

test('`backdrop` changes the scene backdrop', function(assert) {
  assert.expect(10);
  $.Velocity.mock = true;
  const done = assert.async();

  const fixtures = require(`dummy/ember-theater-fixtures/ember-theater-backdrops`)['default'];

  const component = this.subject({
    store: {
      peekRecord(modelName, id) {
        return this.data.filter((fixture) => { return fixture.id === id; })[0];
      } 
    }
  });
  
  component.set('store.data', fixtures.map((fixture) => { return Ember.Object.create(fixture); }));

  run(() => {
    component.append();
    component.send('backdrop', { id: 'beach' }, function() {
      assert.equal($(backdropClass).length, 0, 'promise resolved before backdrop when !sync');
    });
    run.later(() => {
      assert.equal($(backdropClass).length, 1, 'adds the backdrop');
      assert.equal($(backdropClass).first().attr('alt'), 'beach at daytime', 'assigns alt');
      assert.ok(/beach.jpg/.test($(backdropClass).first().css('background-image')), 'assign correct background-image');
      assert.equal($(backdropClass).first().css('opacity'), 1, 'fades the element in by default');

      component.send('backdrop', { id: 'beach--night', effect: { opacity: 0.5  }, sync: true }, function() {
        assert.equal($(backdropClass).length, 2, 'promise is resolved after backdrop is rendered when sync');
        assert.equal($(backdropClass).last().css('opacity'), 0.5, 'uses Velocity to transition element as specified by options object');
      });

      run.later(() => {
        component.send('backdrop', { id: 'beach', effect: { right: '100px' } }, function() { });
        run.later(() => {
          assert.equal($(backdropClass).first().css('right'), '100px', 'can hook into previously rendered backdrop');

          component.send('backdrop', { id: 'beach', destroy: true }, function() { });
          run.later(() => {
            assert.equal($(backdropClass).length, 1, 'destroys element when `destroy`');
            assert.ok(/beach--night.jpg/.test($(backdropClass).first().css('background-image')), 'correct element is destroyed');
          }, 30);
        }, 30);
      }, 50);
    }, 50);
    run.later(() => { done(); }, 200);
  });
});
