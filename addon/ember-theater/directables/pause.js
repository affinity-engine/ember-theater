import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  set,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/pause',
  layer: 'background.pause',

  parseArgs(...args) {
    const keys = Ember.A();

    args.forEach((arg) => {
      switch (typeOf(arg)) {
        case 'string': return keys.pushObject(arg);
        case 'number': return set(this, 'duration', arg);
      }
    });

    set(this, 'keys', keys);
  }
});
