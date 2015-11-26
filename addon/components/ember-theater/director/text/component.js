import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/animate';
import configurable from 'ember-theater/macros/configurable';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  computed,
  get,
  inject,
  on
} = Ember;

const { alias } = computed;

export default Ember.Component.extend(DirectableComponentMixin, {
  classNameBindings: ['additionalClassNames'],
  classNames: ['et-dialogue'],
  layout: layout,

  translator: inject.service('ember-theater/translator'),
  config: inject.service('ember-theater/config'),

  character: alias('directable.character'),
  instantWriteText: alias('directable.options.instant'),
  keys: configurable('text', 'keys.accept'),
  transitionOutDuration: configurable('text', 'transitionOutDuration', 'transitionDuration'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve')) {
      this.resolveAndDestroy();
    }
  }),

  additionalClassNames: computed('config.text.classNames', 'directable.options.classNames', {
    get() {
      const classes = get(this, 'directable.options.classNames') ||
        get(this, 'config').getProperty('text', 'classNames');
      
      return classes.join(' ');
    }
  }).readOnly(),

  resolve() {
    get(this, 'directable.resolve')();
    get(this, 'directable').destroy();
  },

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

  textSpeed: computed('directable.options.speed', 'character.textSpeed', {
    get() {
      return get(this, 'directable.options.speed') ||
        get(this, 'character.textSpeed') ||
        get(this, 'config').getProperty('text', 'speed');
    }
  }),

  actions: {
    completeText() {
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, { opacity: 0 }, { duration }).then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
