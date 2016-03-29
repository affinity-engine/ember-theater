import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/delay',
  layer: 'meta.delay',

  setup(...args) {
    this._entryPoint();

    const keys = set(this, 'attrs.keys', Ember.A());

    args.forEach((arg) => {
      switch (typeOf(arg)) {
        case 'string': return keys.pushObject(arg);
        case 'number': return set(this, 'attrs.duration', arg);
        case 'instance': return set(this, 'attrs.promise', get(arg, 'promise'));
      }
    });

    return this;
  }
});
