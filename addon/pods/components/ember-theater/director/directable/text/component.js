import Ember from 'ember';
import layout from './template';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import multiton from 'ember-multiton-service';

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

  config: multiton('ember-theater/config', 'theaterId'),

  character: alias('directable.attrs.character'),
  instantWriteText: or('instant'),

  keyboardPriority: configurable(configurablePriority, 'keyboardPriority'),
  keys: configurable(configurablePriority, 'keys.accept'),
  instant: configurable(configurablePriority, 'instant'),
  scrollable: configurable(configurablePriority, 'scrollable'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn', 'transition'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),
  customClassNames: configurable(configurablePriority, 'classNames'),
  namePosition: configurable(configurablePriority, 'namePosition'),
  text: configurable(configurablePriority, 'text'),
  textSpeed: configurable(configurablePriority, 'textSpeed'),
  textTransition: configurable(configurablePriority, 'textTransition'),
  textTransitionRate: configurable(configurablePriority, 'textTransitionRate'),
  name: configurable(configurablePriority, 'name'),

  handlePriorSceneRecord: on('didInsertElement', function() {
    if (isPresent(get(this, 'priorSceneRecord'))) {
      this.resolveAndDestroy();
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

  pressEvent: on('mouseUp', 'touchEnd', function(event) {
    // do nothing on right-click or mouse wheel or combo
    if (event.buttons > 1) { return; }

    // do nothing if the text contains highlighted text
    if (!window.getSelection().isCollapsed) { return; }

    set(this, 'pressEventTriggered', true);
  }),

  actions: {
    completeText() {
      if (get(this, 'willResolveExternally')) { return; }

      this.executeTransitionOut().then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
