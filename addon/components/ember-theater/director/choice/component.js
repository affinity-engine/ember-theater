import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import TransitionInMixin from 'ember-theater/mixins/transition-in';
import animate from 'ember-theater/utils/animate';
import configurable, { configurableClassNames } from 'ember-theater/macros/configurable';
import {
  keyUp,
  EKOnInsertMixin
} from 'ember-keyboard';

const {
  Component,
  computed,
  get,
  inject,
  on,
  set
} = Ember;

export default Component.extend(DirectableComponentMixin, EKOnInsertMixin, PerfectScrollbarMixin, TransitionInMixin, {
  layout,

  activeIndex: 0,
  classNameBindings: ['configurableClassNames'],
  classNames: ['et-choice'],

  config: inject.service('ember-theater/config'),
  translator: inject.service('ember-theater/translator'),

  moveUpKeys: configurable('choice', 'keys.moveUp'),
  moveDownKeys: configurable('choice', 'keys.moveDown'),
  cancelKeys: configurable('choice', 'keys.cancel'),
  transitionInDuration: configurable('choice', 'transitionInDuration', 'transitionDuration'),
  transitionOutDuration: configurable('choice', 'transitionOutDuration', 'transitionDuration'),
  configurableClassNames: configurableClassNames('choice'),

  setOpacityAndFadeIn: on('didInsertElement', function() {
    const opacity = this.$().css('opacity');

    this.$().css('opacity', 0);

    animate(this.element, { opacity }, { duration: 500 });
  }),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve')) {
      const choice = get(this, 'autoResolveResult');

      this.resolveAndDestroy(choice);
    }
  }),

  choices: computed('directable.choices.[]', {
    get() {
      const choices = get(this, 'directable.choices');

      return choices.map((value, index) => {
        const key = get(value, 'key') || index;
        const text = get(this, 'translator').translate(value);

        return Ember.$.extend(value, {
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

  setNumericalKey: on('didReceiveAttrs', function() {
    const choices = get(this, 'choices');

    choices.find((choice, index) => {
      if (index >= 9) { return true; }

      this.on(keyUp((index + 1).toString()), () => set(this, 'activeIndex', index));
    });
  }),

  actions: {
    choose(choice) {
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, { opacity: 0 }, { duration }).then(() => {
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
