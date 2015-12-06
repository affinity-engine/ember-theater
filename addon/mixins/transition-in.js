import Ember from 'ember';
import configurable, { configurableClassNames } from 'ember-theater/macros/configurable';
import animate from 'ember-theater/utils/animate';

const {
  Mixin,
  get,
  on
} = Ember;

export default Mixin.create({
  setOpacityAndFadeIn: on('didInsertElement', function() {
    const duration = get(this, 'transitionInDuration');
    const opacity = this.$().css('opacity');

    this.$().css('opacity', 0);

    animate(this.element, { opacity }, { duration });
  })
});
