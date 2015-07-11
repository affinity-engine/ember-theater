import Ember from 'ember';
import PerformableLineMixin from '../../mixins/performable-line';

const { Component, computed, on } = Ember;
const { alias } = computed;

export default Component.extend(PerformableLineMixin, {
  classNames: ['ember-theater-stage__backdrop'],
  tagName: 'img',
  attributeBindings: ['alt'],
  alt: alias('backdrop.caption'),
  backdrop: alias('sceneObject'),

  setImagePath: on('didRender', function() {
    const element = this.$();
    if (element) {
      element.css('background-image',`url(${this.get('backdrop.src')})`);
    }
  })
});
