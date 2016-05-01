import Ember from 'ember';
import { getKeyCode } from 'ember-keyboard';

export default function(app, duration) {
  const keyCode = getKeyCode('F3');

  triggerEvent(document, 'keyup', {
    keyCode,
    which: keyCode,
    altKey: true,
    ctrlKey: true,
    shiftKey: true
  });

  return delay(duration);
}
