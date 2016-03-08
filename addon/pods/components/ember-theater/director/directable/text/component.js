import Ember from 'ember';
import layout from './template';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
  get,
  isPresent,
  on,
  set
} = Ember;

const {
  alias,
  or
} = computed;

const { run: { later } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'character.attrs.text',
  'character.attrs',
  'character.attrs.fixture.text',
  'character.attrs.fixture',
  'config.attrs.director.text',
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, StyleableMixin, TransitionMixin, {
  layout,

  classNames: ['et-text-container'],

  config: multitonService('ember-theater/config', 'theaterId'),

  character: alias('directable.attrs.character'),
  instantWriteText: or('instant', 'scrollable'),

  keyboardPriority: configurable(configurablePriority, 'keyboardPriority'),
  keys: configurable(configurablePriority, 'keys.accept'),
  instant: configurable(configurablePriority, 'instant'),
  scrollable: configurable(configurablePriority, 'scrollable'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn', 'transition'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),
  structuralClassNames: configurable(configurablePriority, 'classNames.structural'),
  namePosition: configurable(configurablePriority, 'namePosition'),
  text: configurable(configurablePriority, 'text'),
  typeAnimation: configurable(configurablePriority, 'typeAnimation'),
  typeSpeed: configurable(configurablePriority, 'typeSpeed'),
  name: configurable(configurablePriority, 'name'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve') && get(this, 'autoResolveResult') === '_RESOLVED') {
      this.resolveAndDestroy(true);
    }
  }),

  transitionInText: on('didInsertElement', function() {
    this.executeTransitionIn();
  }),

  setTimeout: on('didInsertElement', function() {
    const duration = get(this, 'directable.options.duration');

    if (isPresent(duration)) {
      later(() => {
        this.send('completeText');
      }, duration);
    }
  }),

  pressEvent: on('mouseDown', 'touchStart', function(event) {
    // do nothing on right-click or mouse wheel or combo
    if (event.buttons > 1) { return; }

    // even though we prevent default, we still want focus
    event.preventDefault();
    this.focus();

    set(this, 'pressEventTriggered', true);
  }),

  actions: {
    completeText() {
      this.executeTransitionOut().then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
