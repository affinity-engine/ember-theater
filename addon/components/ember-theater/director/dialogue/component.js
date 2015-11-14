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

export default Ember.Component.extend(DirectableComponentMixin, {
  classNameBindings: ['options.class'],
  classNames: ['et-dialogue'],
  currentText: Ember.A(),
  emberTheaterTranslate: inject.service(),
  layout: layout,
  store: inject.service(),

  handleAutoResolve: on('didInitAttrs', function() {
    if (this.get('autoResolve')) {
      this.resolveAndDestroy();
    }
  }),

  resolve() {
    Ember.$('body').off('.speak');
    this.get('directable.resolve')();
    get(this, 'directable').destroy();
  },

  character: computed('directable.character', {
    get() {
      const characterOrId = get(this, 'directable.character');
      const id = typeOf(characterOrId) === 'object' ? get(characterOrId, 'id') : characterOrId;

      return this.get('store').peekRecord('ember-theater-character', id);
    }
  }).readOnly(),

  displayName: computed('directable.character.displayName', {
    get() {
      const displayName = get(this, 'directable.character.displayName');

      return this.get('emberTheaterTranslate').translate(displayName);
    }
  }).readOnly(),

  name: computed('character.name', 'displayName', {
    get() {
      const displayName = this.get('displayName');

      if (displayName) { return displayName; }

      return this.get('emberTheaterTranslate').translate(
        this.get('character.name'),
        `characters.${this.get('directable.character')}`
      );
    }
  }).readOnly(),

  text: computed('directable.text', {
    get() {
      const text = get(this, 'directable.text');

      return this.get('emberTheaterTranslate').translate(text);
    }
  }).readOnly(),

  textSpeed: computed('rapidText', 'directable.options.speed', 'character.textSpeed', {
    get() {
      if (this.get('rapidText')) { return 0; }

      const lineSpeed = this.get('directable.options.speed');
      if (lineSpeed) { return lineSpeed; }

      const characterSpeed = this.get('character.textSpeed');
      if (characterSpeed) { return characterSpeed; }

      return 300;
    }
  }).readOnly(),

  actions: {
    completePage() {
      this.set('pageCompleted', true);
    },

    completeText() {
      animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.resolveAndDestroy();
      });
    },

    turnPage() {
      this.set('triggerPageTurn', false);
    }
  }
});
