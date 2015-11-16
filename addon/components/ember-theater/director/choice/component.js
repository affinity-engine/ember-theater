import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  get,
  inject,
  merge,
  on
} = Ember;

export default Component.extend(DirectableComponentMixin, PerfectScrollbarMixin, WindowResizeMixin, {
  classNames: ['et-choice'],
  translator: inject.service('ember-theater/translator'),
  layout: layout,

  handleautoResolve: on('didInitAttrs', function() {
    if (this.get('autoResolve')) {
      const choice = this.get('autoResolveResult');
      this.resolveAndDestroy(choice);
    }
  }),

  choices: computed('directable.choices', {
    get() {
      const choices = this.get('directable.choices');
      const keys = Object.keys(choices);

      return keys.map((key) => {
        const value = choices[key];
        const text = this.get('translator').translate(value);

        return Ember.$.extend(choices[key], {
          input: '',
          key,
          text
        });
      });
    }
  }).readOnly(),

  header: computed('directable.header', {
    get() {
      const header = this.get('directable.header');

      return this.get('translator').translate(header);
    }
  }).readOnly(),

  actions: {
    choose(choice) {
      animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.resolveAndDestroy(choice);
      });
    }
  }
});
