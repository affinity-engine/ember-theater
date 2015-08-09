import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  on
} = Ember;

export default Component.extend({
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
      return this.get('line.resolve')(path);
    }
  }
});
