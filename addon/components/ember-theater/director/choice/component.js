import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import animate from 'ember-theater/utils/animate';
import {
  keyUp,
  EKOnInsertMixin
} from 'ember-keyboard';

const {
  Component,
  computed,
  get,
  inject,
  merge,
  on,
  set
} = Ember;

export default Component.extend(DirectableComponentMixin, EKOnInsertMixin, PerfectScrollbarMixin, {
  activeIndex: 0,
  classNames: ['et-choice'],
  layout: layout,

  translator: inject.service('ember-theater/translator'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve')) {
      const choice = get(this, 'autoResolveResult');

      this.resolveAndDestroy(choice);
    }
  }),

  choices: computed('directable.choices', {
    get() {
      const choices = get(this, 'directable.choices');
      const keys = Object.keys(choices);

      return keys.map((key) => {
        const value = choices[key];
        const text = get(this, 'translator').translate(value);

        return Ember.$.extend(choices[key], {
          key,
          text
        });
      });
    }
  }).readOnly(),

  header: computed('directable.header', {
    get() {
      const header = get(this, 'directable.header');

      return get(this, 'translator').translate(header);
    }
  }).readOnly(),

  keyboardPriority: computed('directable.options.keyboardPriority', {
    get() {
      return get(this, 'directable.options.keyboardPriority') || 0;
    }
  }).readOnly(),

  setNumericalKey: on('didReceiveAttrs', function() {
    const choices = get(this, 'choices');

    choices.find((choice, index) => {
      if (index >= 9) { return true; }

      this.on(keyUp((index + 1).toString()), () => set(this, 'activeIndex', index));
    });
  }),

  actions: {
    choose(choice) {
      animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.resolveAndDestroy(choice);
      });
    },

    focusDown(index) {
      const length = get(this, 'choices.length');
      const activeIndex = index + 1 === length ? 0 : index + 1;

      set(this, 'activeIndex', activeIndex);
    },

    focusUp(index) {
      const length = get(this, 'choices.length');
      const activeIndex = index - 1 < 0 ? length - 1 : index - 1;

      set(this, 'activeIndex', activeIndex);
    }
  }
});
