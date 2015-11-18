import Ember from 'ember';

const {
  Mixin,
  on
} = Ember;

export default Mixin.create({
  destroyPerfectScrollbar: on('willDestroyElement', function() {
    PerfectScrollbar.destroy(this.element);
  }),

  initializePerfectScrollbar: on('didInsertElement', function() {
    PerfectScrollbar.initialize(this.element, {
      suppressScrollX: true
    });
  }),

  windowResize: on('windowResize', function() {
    PerfectScrollbar.update(this.element);
  })
});
