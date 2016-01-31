import Ember from 'ember';
import layout from './template';
import AdjustableKeyboardMixin from 'ember-theater/mixins/ember-theater/director/adjustable-keyboard';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionInMixin from 'ember-theater/mixins/ember-theater/director/transition-in';
import animate from 'ember-theater/utils/ember-theater/animate';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import {
  keyDown,
  keyUp,
  EKMixin
} from 'ember-keyboard';

const {
  Component,
  computed,
  get,
  getProperties,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;

const mixins = [
  AdjustableKeyboardMixin,
  DirectableComponentMixin,
  EKMixin,
  PerfectScrollbarMixin,
  StyleableMixin,
  TransitionInMixin
];

const configurablePriority = ['directable.options', 'config.attrs.director.choice', 'config.attrs.globals'];

export default Component.extend(...mixins, {
  layout,

  classNames: ['et-choice'],
  classNameBindings: ['decorativeClassNames', 'structuralClassNames'],

  config: multitonService('ember-theater/config', 'theaterId'),
  translator: service('ember-theater/translator'),

  moveUpKeys: configurable(configurablePriority, 'keys.moveUp'),
  moveDownKeys: configurable(configurablePriority, 'keys.moveDown'),
  cancelKeys: configurable(configurablePriority, 'keys.cancel'),
  transitionIn: configurable(configurablePriority, 'transitionIn.effect'),
  transitionInDuration: configurable(configurablePriority, 'transitionIn.duration', 'transitionDuration'),
  transitionOut: configurable(configurablePriority, 'transitionOut.effect'),
  transitionOutDuration: configurable(configurablePriority, 'transitionOut.duration', 'transitionDuration'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),
  structuralClassNames: configurable(configurablePriority, 'classNames.structural'),

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

  setupKeys: on('init', function() {
    const { moveDownKeys, moveUpKeys } = getProperties(this, 'moveDownKeys', 'moveUpKeys');

    moveDownKeys.forEach((key) => this.on(keyDown(key), (event) => this.focusDown(event)));
    moveUpKeys.forEach((key) => this.on(keyDown(key), (event) => this.focusUp(event)));
  }),

  focusDown(event) {
    event.preventDefault();

    const choices = this.$('button');
    const current = document.activeElement;
    const index = choices.index(current);
    const length = choices.length;
    const newIndex = index + 1 === length ? 0 : index + 1;

    choices.eq(newIndex).focus();
  },

  focusUp(event) {
    event.preventDefault();

    const choices = this.$('button');
    const current = document.activeElement;
    const index = choices.index(current);
    const length = choices.length;
    const newIndex = index - 1 < 0 ? length - 1 : index - 1;

    choices.eq(newIndex).focus();
  },

  actions: {
    choose(choice) {
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      this.$().parents('.ember-theater').trigger('focus');

      animate(this.element, effect, { duration }).then(() => {
        this.resolveAndDestroy(choice);
      });
    }
  }
});
