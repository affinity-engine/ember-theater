import Ember from 'ember';
import PerformableLineMixin from '../../mixins/performable-line';

const { 
  Component, 
  computed, 
  on 
} = Ember;
const { alias } = computed;

export default Component.extend(PerformableLineMixin, {
  alt: alias('backdrop.caption'),
  attributeBindings: ['alt'],
  backdrop: alias('sceneObject'),
  classNames: ['ember-theater-stage__backdrop'],
  tagName: 'img',

  setImagePath: on('didRender', function() {
    const element = this.$();

    if (element) {
      element.css('background-image',`url(${this.get('backdrop.src')})`);
    }

    this.executeLine();
  })
});
