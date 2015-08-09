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

  windowResize: on('windowResize', function() {
    this.set('keyPressCount', 0);
    Ember.$('.ember-theater-stage-dialogue__body').css('top', 0);
  }),

  actions: {
    choose(path) {
      return this.get('line.resolve')(path);
    }
  }
});
