import Ember from 'ember';
import { getKeyCode } from 'ember-keyboard';

export default function(app, duration) {
  keyEvent(document, 'keyup', getKeyCode('p'));

  return delay(duration);
}
