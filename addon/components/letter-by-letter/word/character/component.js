import Ember from 'ember';
import layout from './template';

const {
  Component,
  on,
  run
} = Ember;

export default Component.extend({
  classNames: ['letter-by-letter__character'],
  layout: layout,
  tagName: 'span',

  checkIfCurrent: on('didRender', function() {
    if (!this.get('visible') && this.get('activeCharacterIndex') === this.get('index')) {
      this.set('visible', true);

      const speed = this.get('speed');

      Ember.$.Velocity.animate(this.element, {
        opacity: [1, 0],
        translateY: [0, '-0.3vh'],
        translateX: [0, '0.2vh']
      }, { duration: speed * 10 });

      run.later(() => {
        if (this.get('isDestroying')) { return; }

        this.attrs.incrementActiveCharacterIndex();
      }, speed);
    }
  })
});
