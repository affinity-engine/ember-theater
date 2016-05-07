import Ember from 'ember';
import layout from './template';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';
import {
  keyDown,
  EKMixin
} from 'ember-keyboard';

const {
  Component,
  computed,
  get,
  getProperties,
  isPresent,
  on,
  typeOf
} = Ember;

const { run: { next } } = Ember;

const mixins = [
  EKMixin,
  PerfectScrollbarMixin,
  StyleableMixin
];

const configurablePriority = [
  'directable.attrs',
  'config.attrs.director.menu',
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend(...mixins, {
  layout,

  classNames: ['et-menu', 'et-menu-single-column'],
  classNameBindings: ['joinedCustomClassNames'],

  config: multiton('ember-theater/config', 'theaterId'),

  keyboardPriority: configurable(configurablePriority, 'keyboardPriority'),
  moveUpKeys: configurable(configurablePriority, 'keys.moveUp'),
  moveDownKeys: configurable(configurablePriority, 'keys.moveDown'),
  customClassNames: configurable(configurablePriority, 'classNames'),

  joinedCustomClassNames: computed('customClassNames.[]', {
    get() {
      const classNames = get(this, 'customClassNames');

      return typeOf(classNames) === 'array' ? classNames.join(' ') : classNames;
    }
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
    this.keyboardEvent(event, (index, length) => {
      return index + 1 === length ? 0 : index + 1;
    });
  },

  focusUp(event) {
    this.keyboardEvent(event, (index, length) => {
      return index - 1 < 0 ? length - 1 : index - 1;
    });
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
  }
});
