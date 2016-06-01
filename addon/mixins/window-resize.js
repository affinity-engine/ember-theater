import Ember from 'ember';

const {
  Evented,
  Mixin,
  on
} = Ember;

const { run: { debounce } } = Ember;

export default Mixin.create(Evented, {
  _oldWindowHeight: null,
  _oldWindowWidth: null,

  _destroyResizeHandler: on('willDestroyElement', function() {
    Ember.$(window).off(`resize.${this.elementId}`);
  }),

  _initResizeHandler: on('didInsertElement', function() {
    const debounceDuration = 10;

    Ember.$(window).on(`resize.${this.elementId}`, () => {
      debounce(this, this._triggerResizeListeners, debounceDuration);
    });
  }),

  _triggerResizeListeners() {
    this.trigger('windowResize');
  }
});
