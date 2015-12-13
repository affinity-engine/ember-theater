import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  get,
  merge,
  observer,
  on
} = Ember;

export default Mixin.create({
  perform: on('didInsertElement', observer('directable.effect', function() {
    const directable = get(this, 'directable');
    const effect = get(directable, 'effect');
    const options = get(directable, 'options') || {};

    if (get(this, 'autoResolve')) {
      merge(options, { duration: 0 });
    }

    animate(this.element, effect, options).then(() => {
      this.resolve();
    });
  }))
});
