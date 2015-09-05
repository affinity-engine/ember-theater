import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  computed,
  inject,
  on
} = Ember;

export default Ember.Component.extend(DirectableComponentMixin, {
  classNameBindings: ['line.class'],
  classNames: ['et-dialogue'],
  currentText: Ember.A(),
  keyboard: inject.service(),
  intlWrapper: inject.service(),
  layout: layout,
  store: inject.service(),

  character: computed('line.character', {
    get() {
      return this.get('store').peekRecord('ember-theater-character', this.get('line.character'));
    }
  }).readOnly(),

  displayName: computed('line.displayName', 'line.intl.displayName', {
    get() {
      return this.get('intlWrapper').tryIntl(
        this.get('line.displayName'),
        this.get('line.intl.displayName')
      );
    }
  }).readOnly(),

  destroyKeyPressWatcher: on('willDestroyElement', function() {
    this.get('keyboard').stopListeningFor(' ', this, '_resolveKeyPress');
  }),

  name: computed('character.name', 'line.displayName', 'line.intl', {
    get() {
      const displayName = this.get('displayName');
      if (displayName) { return displayName; }

      return this.get('intlWrapper').tryIntl(
        this.get('character.name'),
        `characters.${this.get('line.character')}`
      );
    }
  }).readOnly(),

  setupKeyPressWatcher: on('didInsertElement', function() {
    this.get('keyboard').listenFor(' ', this, '_resolveKeyPress');
  }),

  text: computed('line.intl', 'line.text', {
    get() {
      return this.get('intlWrapper').tryIntl(
        this.get('line.text'),
        this.get('line.intl.text'),
        this.get('line.intl')
      );
    }
  }).readOnly(),

  textSpeed: computed('rapidText', 'line.speed', 'character.textSpeed', {
    get() {
      if (this.get('rapidText')) { return 0; }

      const lineSpeed = this.get('line.speed');
      if (lineSpeed) { return lineSpeed; }

      const characterSpeed = this.get('character.textSpeed');
      if (characterSpeed) { return characterSpeed; }

      return 20;
    }
  }).readOnly(),

  _resolveKeyPress() {
    if (this.get('pageCompleted')) {
      this.setProperties({
        pageCompleted: false,
        rapidText: false,
        triggerPageTurn: true
      });
    } else {
      this.set('rapidText', true);
    }
  },

  actions: {
    completePage() {
      this.set('pageCompleted', true);
    },

    completeText() {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        Ember.$('body').off('.speak');
        this.get('line.resolve')();
        this.attrs.destroyDirectable();
      });
    },

    turnPage() {
      this.set('triggerPageTurn', false);
    }
  }
});
