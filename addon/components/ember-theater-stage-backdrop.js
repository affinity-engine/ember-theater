import Ember from 'ember';

const { Component, computed, on, observer } = Ember;
const { alias } = computed;

export default Component.extend({
  classNames: ['ember-theater-stage__backdrop'],
  tagName: 'img',
  attributeBindings: ['alt'],
  alt: alias('backdrop.caption'),

  associateBackdropWithComponent: on('init', function() {
    this.set('backdrop.component', this);
  }),
  
  setImagePath: on('didInsertElement', observer('backdrop.src', function() {
    const element = this.$();
    if (element) {
      element.css('background-image',`url(${this.get('backdrop.src')})`);
    }
  }))
});
