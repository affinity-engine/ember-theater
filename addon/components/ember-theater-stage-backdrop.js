import Ember from 'ember';
import PerformableLineMixin from '../mixins/performable-line';

const { Component, computed, on, observer, run } = Ember;
const { alias } = computed;

export default Component.extend(PerformableLineMixin, {
  classNames: ['ember-theater-stage__backdrop'],
  tagName: 'img',
  attributeBindings: ['alt'],
  alt: alias('backdrop.caption'),
  line: alias('backdrop.line'),

  setImagePath: on('didInsertElement', observer('backdrop.src', function() {
    const element = this.$();
    if (element) {
      element.css('background-image',`url(${this.get('backdrop.src')})`);
    }
  }))
});
