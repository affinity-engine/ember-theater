import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/ember-theater/animate';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import AdjustableKeyboardMixin from 'ember-theater/mixins/ember-theater/director/adjustable-keyboard';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import StyleableMixin from 'ember-theater/mixins/ember-theater/director/styleable';
import TransitionInMixin from 'ember-theater/mixins/ember-theater/director/transition-in';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
  get,
  isPresent,
  on
} = Ember;

const {
  alias,
  or
} = computed;

const { run: { later } } = Ember;
const { inject: { service } } = Ember;

const configurablePriority = ['directable.options', 'character.text', 'character', 'config.attrs.director.text', 'config.attrs.globals'];

export default Component.extend(AdjustableKeyboardMixin, DirectableComponentMixin, StyleableMixin, TransitionInMixin, {
  layout,

  classNames: ['et-text'],
  classNameBindings: ['decorativeClassNames', 'structuralClassNames', 'scrollable:et-scrollable'],

  config: multitonService('ember-theater/config', 'theaterId'),
  translator: service('ember-theater/translator'),

  character: alias('directable.character'),
  instantWriteText: or('instant', 'scrollable'),

  keys: configurable(configurablePriority, 'keys.accept'),
  instant: configurable(configurablePriority, 'instant'),
  scrollable: configurable(configurablePriority, 'scrollable'),
  transitionIn: configurable(configurablePriority, 'transitionIn.effect'),
  transitionInDuration: configurable(configurablePriority, 'transitionIn.duration', 'transitionDuration'),
  transitionOut: configurable(configurablePriority, 'transitionOut.effect'),
  transitionOutDuration: configurable(configurablePriority, 'transitionOut.duration', 'transitionDuration'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),
  structuralClassNames: configurable(configurablePriority, 'classNames.structural'),
  textAnimation: configurable(configurablePriority, 'textAnimation'),
  textSpeed: configurable(configurablePriority, 'textSpeed'),
  displayName: configurable(configurablePriority, 'name'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve') && get(this, 'autoResolveResult') === '_RESOLVED') {
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

  name: computed('displayName', {
    get() {
      return get(this, 'translator').translate(get(this, 'displayName'));
    }
  }).readOnly(),

  text: computed('directable.text', {
    get() {
      const text = get(this, 'directable.text');

      return get(this, 'translator').translate(text);
    }
  }).readOnly(),

  actions: {
    completeText() {
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, effect, { duration }).then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
