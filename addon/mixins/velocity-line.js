import Ember from 'ember';
import animate from 'ember-theater/utils/animate';

const { 
  get,
  isPresent,
  merge,
  Mixin
} = Ember;

export default Mixin.create({
  executeLine() {
    const line = get(this, 'line');
    const effect = get(line, 'effect') || 'transition.fadeIn';
    const options = get(line, 'options') || {};

    if (get(this, 'autoResolve')) {
      merge(options, { duration: 0 });
    }

    animate(this.element, effect, options).then(() => {
      const resolve = get(line, 'resolve');

      if (isPresent(resolve)) {
        resolve();
      }
    });
  }
});
