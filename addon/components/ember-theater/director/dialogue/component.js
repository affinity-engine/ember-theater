import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/animate';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  computed,
  get,
  inject,
  on,
  typeOf
} = Ember;

const { alias } = computed;

export default Ember.Component.extend(DirectableComponentMixin, {
  classNameBindings: ['directable.options.class'],
  classNames: ['et-dialogue'],
  layout: layout,

  translator: inject.service('ember-theater/translator'),
  config: inject.service('ember-theater/config'),

  character: alias('directable.character'),
  instantWriteText: alias('directable.options.instant'),

  handleAutoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve')) {
      this.resolveAndDestroy();
    }
  }),

  resolve() {
    get(this, 'directable.resolve')();
    get(this, 'directable').destroy();
  },

  keys: computed('directable.options.keys', {
    get() {
      return get(this, 'directable.options.keys') || get(this, 'config.acceptKeys');
    }
  }).readOnly(),

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
      const defaultSpeed = get(this, 'config.textSpeed');

      return get(this, 'directable.options.speed') ||
        get(this, 'character.textSpeed') ||
        defaultSpeed;
    }
  }),

  actions: {
    completeText() {
      animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
