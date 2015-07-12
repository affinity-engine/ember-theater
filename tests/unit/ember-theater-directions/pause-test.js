import { module, test } from 'qunit';
import Ember from 'ember';
import Pause from 'ember-theater/ember-theater-directions/pause';

const { run } = Ember;

module('ember-theater-direction:pause', 'Unit | Ember Theater Direction | pause', {
  // Specify the other units that are required for this test.
});

test('`perform` executes the current line', function(assert) {
  assert.expect(4);

  let durationDelayed, keyPressDelayed = false;
  const done = assert.async();
  const pause = Pause;

  run(() => {
    pause.perform({ duration: 10, resolve() {
      durationDelayed = true;
      assert.ok(durationDelayed, 'has waited for the `duration` to complete');

      pause.perform({ keyPress: true, resolve() {
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
