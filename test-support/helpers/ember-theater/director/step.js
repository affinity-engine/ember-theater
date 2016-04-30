import Ember from 'ember';
import { getKeyCode } from 'ember-keyboard';

export default function(app) {
  keyEvent(document, 'keyup', getKeyCode('p'));
}
