import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/animate';
import configurable, { configurableClassNames } from 'ember-theater/macros/ember-theater/director/configurable';
import AdjustableKeyboardMixin from 'ember-theater/mixins/ember-theater/director/adjustable-keyboard';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionInMixin from 'ember-theater/mixins/ember-theater/director/transition-in';

const {
  Component,
  computed,
  get,
  inject,
  isPresent,
  on
} = Ember;

const {
  alias,
  or
} = computed;

const { run: { later } } = Ember;

export default Component.extend(AdjustableKeyboardMixin, DirectableComponentMixin, StyleableMixin, TransitionInMixin, {
  layout,

  classNames: ['et-text'],
  classNameBindings: ['configurableClassNames', 'scrollable:et-scrollable'],

  translator: inject.service('ember-theater/translator'),
  config: inject.service('ember-theater/config'),

  character: alias('directable.character'),
  keys: configurable('text', 'keys.accept'),
  instant: configurable('text', 'instant'),
  scrollable: configurable('text', 'scrollable'),
  instantWriteText: or('instant', 'scrollable'),
  transitionIn: configurable('text', 'transitionIn.effect'),
  transitionInDuration: configurable('text', 'transitionIn.duration', 'transitionDuration'),
  transitionOut: configurable('text', 'transitionOut.effect'),
  transitionOutDuration: configurable('text', 'transitionOut.duration', 'transitionDuration'),
  configurableClassNames: configurableClassNames('text'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve') && get(this, 'autoResolveResult') === true) {
      this.resolveAndDestroy(true);
    }
  }),

  setTimeout: on('didInsertElement', function() {
    const duration = get(this, 'directable.options.duration');

    if (isPresent(duration)) {
      later(() => {
        this.send('completeText');
      }, duration);
    }
  }),

  initializePerfectScrollbar: on('didRender', function() {
    if (get(this, 'scrollable')) {
      PerfectScrollbar.initialize(this.$().find('.et-text-body-container')[0], {
        suppressScrollX: true
      });
    }
  }),

  displayName: computed('directable.options.displayName', {
    get() {
      const displayName = get(this, 'directable.options.displayName');

      return get(this, 'translator').translate(displayName);
    }
  }).readOnly(),

  name: computed('character.name', 'displayName', {
    get() {
      return get(this, 'displayName') ||
        get(this, 'translator').translate(get(this, 'character.name'));
    }
  }).readOnly(),

  text: computed('directable.text', {
    get() {
      const text = get(this, 'directable.text');

      return get(this, 'translator').translate(text);
    }
  }).readOnly(),

  textStyle: computed('directable.options.textStyle', 'character.textStyle', {
    get() {
      return get(this, 'directable.options.textStyle') ||
        get(this, 'character.textStyle') ||
        get(this, 'config').getProperty('text', 'textStyle');
    }
  }),

  textSpeed: computed('directable.options.textSpeed', 'character.textSpeed', {
    get() {
      return get(this, 'directable.options.textSpeed') ||
        get(this, 'character.textSpeed') ||
        get(this, 'config').getProperty('text', 'textSpeed');
    }
  }),

  actions: {
    completeText() {
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, effect, { duration }).then(() => {
        this.resolveAndDestroy(true);
      });
    }
  }
});
