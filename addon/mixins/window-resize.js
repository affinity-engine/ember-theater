import Ember from 'ember';

const { Mixin, Evented, on } = Ember;

export default Mixin.create(Evented, {
  _oldWindowWidth: null,
  _oldWindowHeight: null,

  _initResizeHandler: on('init', function() {
    Ember.$(window).on('resize', () => {
      Ember.run.debounce(this, this._triggerResizeListeners, 10);
    });
  }),

  _destroyResizeHandler: on('willDestroyElement', function() {
    Ember.$(window).off('resize', '**');
  }),

  _triggerResizeListeners() {
    this.trigger('windowResize');
  }
});