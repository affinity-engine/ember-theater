import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNames: ['ember-theater-stage__choice'],
  layout: layout,
  tagName: 'ul',

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
