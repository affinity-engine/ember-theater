import Ember from 'ember';

const {
  Evented, 
  Mixin, 
  on 
} = Ember;

export default Mixin.create(Evented, {
  _oldWindowHeight: null,
  _oldWindowWidth: null,

  _destroyResizeHandler: on('willDestroyElement', function() {
    Ember.$(window).off('resize', '**');
  }),

  _initResizeHandler: on('init', function() {
    Ember.$(window).on('resize', () => {
      Ember.run.debounce(this, this._triggerResizeListeners, 10);
    });
  }),

  _triggerResizeListeners() {
    this.trigger('windowResize');
  }
});
