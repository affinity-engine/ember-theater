import Ember from 'ember';
import layout from './template';
import AdjustableKeyboardMixin from 'ember-theater/mixins/ember-theater/director/adjustable-keyboard';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionInMixin from 'ember-theater/mixins/ember-theater/director/transition-in';
import animate from 'ember-theater/utils/ember-theater/animate';
import configurable, { configurableClassNames } from 'ember-theater/macros/ember-theater/director/configurable';
import {
  keyUp,
  EKMixin,
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

export default Component.extend(AdjustableKeyboardMixin, DirectableComponentMixin, EKMixin, EKOnInsertMixin, PerfectScrollbarMixin, StyleableMixin, TransitionInMixin, {
  layout,

  activeIndex: 0,
  classNameBindings: ['configurableClassNames'],
  classNames: ['et-choice'],

  config: inject.service('ember-theater/config'),
  translator: inject.service('ember-theater/translator'),

  moveUpKeys: configurable('choice', 'keys.moveUp'),
  moveDownKeys: configurable('choice', 'keys.moveDown'),
  cancelKeys: configurable('choice', 'keys.cancel'),
  transitionIn: configurable('choice', 'transitionIn.effect'),
  transitionInDuration: configurable('choice', 'transitionIn.duration', 'transitionDuration'),
  transitionOut: configurable('choice', 'transitionOut.effect'),
  transitionOutDuration: configurable('choice', 'transitionOut.duration', 'transitionDuration'),
  configurableClassNames: configurableClassNames('choice'),

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
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, effect, { duration }).then(() => {
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
