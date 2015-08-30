import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  computed,
  inject,
  merge,
  on,
  run
} = Ember;

export default Ember.Component.extend(DirectableComponentMixin, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__dialogue'],
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
      const intl = this.get('line.intl.displayName');

      if (intl) {
        return this.get('intlWrapper').formatMessage(intl);
      } else {
        return this.get('line.displayName');
      }
    }
  }),

  destroyKeyPressWatcher: on('willDestroyElement', function() {
    this.get('keyboard').stopListeningFor(' ', this, '_resolveKeyPress');
  }),

  name: computed('character.name', 'line.displayName', 'line.intl', {
    get() {
      const displayName = this.get('displayName');
      if (displayName) { return displayName; }

      if (this.get('line.intl')) {
        const key = `characters.${this.get('line.character')}`;
        const translation = this.get('intlWrapper').formatMessage(key); 

        if (translation) { return translation; }
      }

      return this.get('character.name');
    }
  }).readOnly(),

  setupKeyPressWatcher: on('didInsertElement', function() {
    this.get('keyboard').listenFor(' ', this, '_resolveKeyPress');
  }),

  text: computed('line.intl', 'line.text', {
    get() {
      const intlId = this.get('line.intl.text') ? this.get('line.intl.text') : this.get('line.intl');

      if (intlId) {
        return this.get('intlWrapper').formatMessage(intlId);
      } else {
        return this.get('line.text');
      }
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

  _resolveKeyPress(event) {
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
