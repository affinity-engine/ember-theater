import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
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
  isPresent,
  on,
  set,
  typeOf
} = Ember;

const { inject: { service } } = Ember;
const { run: { next } } = Ember;

const mixins = [
  DirectableComponentMixin,
  EKMixin,
  PerfectScrollbarMixin,
  StyleableMixin,
  TransitionMixin
];

const configurablePriority = [
  'directable.attrs',
  'config.attrs.director.menu',
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend(...mixins, {
  layout,

  classNames: ['et-menu'],
  classNameBindings: ['decorativeClassNames', 'structuralClassNames'],

  config: multitonService('ember-theater/config', 'theaterId'),
  translator: service('ember-theater/translator'),

  choices: configurable(configurablePriority, 'choices'),
  header: configurable(configurablePriority, 'header'),
  keyboardPriority: configurable(configurablePriority, 'keyboardPriority'),
  moveUpKeys: configurable(configurablePriority, 'keys.moveUp'),
  moveDownKeys: configurable(configurablePriority, 'keys.moveDown'),
  cancelKeys: configurable(configurablePriority, 'keys.cancel'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn', 'transition'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),
  structuralClassNames: configurable(configurablePriority, 'classNames.structural'),

  transitionInMenu: on('didInsertElement', function() {
    this.executeTransitionIn();
  }),

  handlePriorSceneRecord: on('didInsertElement', function() {
    if (isPresent(get(this, 'priorSceneRecord'))) {
      const menu = get(this, 'priorSceneRecord');

      this.send('choose', menu);
    }
  }),

  translatedChoices: computed('choices.[]', {
    get() {
      const choices = get(this, 'choices');

      return choices.map((value, index) => {
        const key = get(value, 'key') || index;
        const text = get(this, 'translator').translate(value);

        return Ember.Object.create({
          ...value,
          key,
          text: typeOf(text) === 'string' ? text : ''
        });
      });
    }
  }).readOnly(),

  translatedHeader: computed('header', {
    get() {
      const header = get(this, 'header');

      return get(this, 'translator').translate(header);
    }
  }).readOnly(),

  setNumericalKey: on('didReceiveAttrs', function() {
    const choices = get(this, 'translatedChoices');

    choices.find((menu, index) => {
      if (index >= 9) { return true; }

      this.on(keyUp((index + 1).toString()), () => set(this, 'activeIndex', index));
    });
  }),

  setupKeys: on('init', function() {
    const { moveDownKeys, moveUpKeys } = getProperties(this, 'moveDownKeys', 'moveUpKeys');

    moveDownKeys.forEach((key) => this.on(keyDown(key), (event) => this.focusDown(event)));
    moveUpKeys.forEach((key) => this.on(keyDown(key), (event) => this.focusUp(event)));
  }),

  focusFirstMenu: on('didInsertElement', function() {
    next(() => {
      if (get(this, 'keyboardActivated')) {
        this.focusDown();
      }
    });
  }),

  focusDown(event) {
    this.keyboardEvent(event, (index, length) => index + 1 === length ? 0 : index + 1);
  },

  focusUp(event) {
    this.keyboardEvent(event, (index, length) => index - 1 < 0 ? length - 1 : index - 1);
  },

  keyboardEvent(event, indexCallback) {
    if (isPresent(event)) {
      event.preventDefault();
    }

    const choices = this.$('button');
    const current = document.activeElement;
    const index = choices.index(current);
    const length = choices.length;
    const newIndex = indexCallback(index, length);

    choices.eq(newIndex).focus();
  },

  actions: {
    choose(menu) {
      set(this, 'directable.direction.result', menu);

      this.$().parents('.ember-theater').trigger('focus');

      this.executeTransitionOut().then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
