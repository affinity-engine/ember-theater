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
    component.send('backdrop', { id: 'beach', resolve() {
      assert.equal($(backdropClass).first().css('opacity'), 0, 'promise resolved before backdrop when !sync');
    }});
    run.later(() => {
      assert.equal($(backdropClass).first().attr('alt'), 'beach at daytime', 'assigns alt');
      assert.ok(/beach.jpg/.test($(backdropClass).first().css('background-image')), 'assign correct background-image');
      assert.equal($(backdropClass).first().css('opacity'), 1, 'fades the element in by default');

      component.send('backdrop', { id: 'beach--night', effect: { opacity: 0.5  }, sync: true, resolve() {
        assert.equal($(backdropClass).last().css('opacity'), 0.5, 'promise is resolved after backdrop is rendered when sync');
      }});

      run.later(() => {
        component.send('backdrop', { id: 'beach', effect: { right: '100px' }, resolve() { assert.ok(true); } });
        run.later(() => {
          assert.equal($(backdropClass).first().css('right'), '100px', 'can hook into previously rendered backdrop');

          component.send('backdrop', { id: 'beach', destroy: true, resolve() { assert.ok(true); } });
          run.later(() => {
            assert.equal($(backdropClass).length, 1, 'destroys element when `destroy`');
            assert.ok(/beach--night.jpg/.test($(backdropClass).first().css('background-image')), 'correct element is destroyed');
          }, 50);
        }, 50);
      }, 50);
    }, 50);
    run.later(() => { done(); }, 300);
  });
});

test('`pause` postpones the execution of the next line of the script', function(assert) {
  assert.expect(4);
  let durationDelayed, keyPressDelayed = false;
  const done = assert.async();
  const component = this.subject();
  run(() => {
    component.append();
    component.send('pause', { duration: 10, resolve() {
      durationDelayed = true;
      assert.ok(durationDelayed, 'has waited for the `duration` to complete');

      component.send('pause', { keyPress: true, resolve() {
        keyPressDelayed = true;
        assert.ok(keyPressDelayed, 'has waited for the keyPress');
      }});
      assert.ok(!keyPressDelayed, 'will wait for the keyPress');
      Ember.$('body').trigger({ type: 'keypress', which: 32, keyCode: 32 });

    }});
    assert.ok(!durationDelayed, 'will wait for the `duration` to complete');

    run.later(() => { done(); }, 30);
  });
});
