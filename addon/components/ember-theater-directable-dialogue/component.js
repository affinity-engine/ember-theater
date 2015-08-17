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
