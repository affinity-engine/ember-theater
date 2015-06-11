import Ember from 'ember';

const { Component, on, observer } = Ember;

export default Component.extend({
  classNames: ['theater-stage__background'],
  
  setImagePath: on('didInsertElement', observer('background.imagePath', function() {
    const element = this.$();
    if (element) {
      element.css('background-image',`url(${this.get('background.imagePath')})`);
    }
  }))
});
