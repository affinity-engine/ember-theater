import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from '../../mixins/directable-component';
import PerfectScrollbarMixin from '../../mixins/perfect-scrollbar';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  Component,
  computed,
  on
} = Ember;

export default Component.extend(DirectableComponentMixin, PerfectScrollbarMixin, WindowResizeMixin, {
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

  actions: {
    choose(path) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.get('line.resolve')(path);
        this.attrs.destroyDirectable();
      });
    }
  }
});
