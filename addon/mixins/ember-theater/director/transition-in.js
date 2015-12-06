import Ember from 'ember';
import configurable, { configurableClassNames } from 'ember-theater/macros/director/configurable';
import animate from 'ember-theater/utils/animate';

const {
  Mixin,
  get,
  on,
  set
} = Ember;

export default Mixin.create({
  executeTransitionIn: on('didInsertElement', function() {
    const effect = get(this, 'transitionIn');
    const duration = get(this, 'transitionInDuration');

    animate(this.element, effect, { duration: 0 });
    animate(this.element, 'reverse', { duration });
  })
});
