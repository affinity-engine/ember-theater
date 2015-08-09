import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  Component,
  computed,
  on
} = Ember;

export default Component.extend(WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__choice'],
  layout: layout,

  choices: computed('line.choices', function() {
    const choices = this.get('line.choices');
    const keys = Object.keys(choices);

    return keys.map((key) => {
      return { path: key, text: choices[key] };
    });
  }),

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
  }),

  actions: {
    choose(path) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.get('line.resolve')(path);
      });
    }
  }
});
