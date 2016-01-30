import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  layer: 'meta.pause',

  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  perform(resolve, ...args) {
    const keys = Ember.A();

    args.forEach((arg) => {
      switch (typeOf(arg)) {
        case 'string': return keys.pushObject(arg);
        case 'number': return set(this, 'duration', arg);
      }
    });

    const duration = get(this, 'duration');
    const autoResolve = get(this, 'autoResolve');

    const properties = {
      autoResolve,
      duration,
      keys
    };

    get(this, 'stageManager').handleDirectable(null, 'pause', properties, resolve);
  }
});
