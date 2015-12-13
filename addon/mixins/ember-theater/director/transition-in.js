import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  get,
  on
} = Ember;

export default Mixin.create({
  executeTransitionIn: on('didInsertElement', function() {
    const effect = get(this, 'transitionIn');
    const duration = get(this, 'transitionInDuration');

    animate(this.element, effect, { duration: 0 });
    animate(this.element, 'reverse', { duration });
  })
});
