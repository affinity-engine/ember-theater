import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from '../../mixins/directable-component';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  computed,
  inject,
  merge,
  on
} = Ember;

export default Ember.Component.extend(DirectableComponentMixin, WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__dialogue'],
  intl: inject.service(),
  keyboard: inject.service(),
  layout: layout,
  store: inject.service(),

  character: computed('line.character', {
    get() {
      return this.get('store').peekRecord('ember-theater-character', this.get('line.character'));
    }
  }).readOnly(),

  destroyKeyPressWatcher: on('willDestroyElement', function() {
    this.get('keyboard').stopListeningFor(' ', this, '_resolveKeyPress');
  }),

  displayName: computed('character.name', 'line.displayName', 'line.intl', {
    get() {
      const displayName = this.get('line.displayName');
      if (displayName) { return displayName; }

      if (this.get('line.intl')) {
        const intl = this.get('intl');
        const key = `characters.${this.get('line.character')}`;
        const translation = intl.get('adapter').findTranslationByKey(intl.get('locale'), key); 
        
        if (translation) { return translation; }
      }

      return this.get('character.name');
    }
  }).readOnly(),

  displayText: computed('line.intl.id', 'line.text', {
    get() {
      const intlId = this.get('line.intl.id');

      if (intlId) {
        const intl = this.get('intl');
        const translation = intl.findTranslationByKey(intlId);
        return intl.formatMessage(translation, this.get('line.intl.variables'));
      } else {
        return this.get('line.text');
      }
    }
  }).readOnly(),

  setupKeyPressWatcher: on('didInsertElement', function() {
    this.get('keyboard').listenFor(' ', this, '_resolveKeyPress');
  }),

  windowResize: on('windowResize', function() {
    this.set('keyPressCount', 0);
    Ember.$('.ember-theater-stage-dialogue__body').css('top', 0);
  }),

  _resolveKeyPress(event) {
      this.incrementProperty('keyPressCount');

      const scrollDistance = $('.ember-theater-stage-dialogue__body-container').height() * this.get('keyPressCount') * -1;
      const inner = Ember.$('.ember-theater-stage-dialogue__body')[0];

      Ember.$.Velocity.animate(inner, { top: scrollDistance }, { duration: 250 }).then(() => {
        if (parseFloat(Ember.$(inner).css('top')) * -1 >= inner.offsetHeight) {
          Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
            Ember.$('body').off('.speak');
            this.get('line.resolve')();
            this.attrs.destroyDirectable();
          });
        }
      });
  }
});
