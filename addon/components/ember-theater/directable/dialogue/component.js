import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  computed,
  get,
  inject,
  on
} = Ember;

export default Ember.Component.extend(DirectableComponentMixin, {
  acceptsKeyResponder: true,
  classNameBindings: ['line.class'],
  classNames: ['et-dialogue'],
  currentText: Ember.A(),
  intlWrapper: inject.service(),
  layout: layout,
  store: inject.service(),

  makeKeyResponder: on('didInsertElement', function() {
    this.becomeKeyResponder();
  }),

  unmakeKeyResponder: on('willDestroyElement', function() {
    this.resignKeyResponder();
  }),

  insertSpace() {
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

  character: computed('line.character', {
    get() {
      return this.get('store').peekRecord('ember-theater-character', this.get('line.character'));
    }
  }).readOnly(),

  displayName: computed('line.displayName', {
    get() {
      const displayName = this.get('line.displayName');

      return this.get('intlWrapper').tryIntl(
        displayName,
        displayName
      );
    }
  }).readOnly(),

  name: computed('character.name', 'displayName', {
    get() {
      const displayName = this.get('displayName');
      
      if (displayName) { return displayName; }

      return this.get('intlWrapper').tryIntl(
        this.get('character.name'),
        `characters.${this.get('line.character')}`
      );
    }
  }).readOnly(),

  text: computed('line.text', {
    get() {
      const line = this.get('line');
      const text = get(line, 'text');

      return this.get('intlWrapper').tryIntl(
        text,
        line
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
