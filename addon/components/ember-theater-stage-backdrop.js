import Ember from 'ember';

const { Component, on, observer } = Ember;

export default Component.extend({
  classNames: ['ember-theater-stage__backdrop'],

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
