import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  get,
  getProperties,
  merge,
  observer,
  on
} = Ember;

export default Mixin.create({
  perform: on('didInsertElement', observer('transition.effect', function() {
    const transition = get(this, 'transition');
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    if (get(this, 'autoResolve')) {
      merge(options, { duration: 0 });
    }

    animate(this.element, effect, options).then(() => {
      this.resolve();
    });
  }))
});
