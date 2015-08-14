import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  computed,
  inject,
  merge,
  on
} = Ember;

export default Ember.Component.extend(WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__dialogue'],
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

  displayName: computed('character.name', 'line.displayName', {
    get() {
      const displayName = this.get('line.displayName');
      return displayName ? displayName : this.get('character.name');
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
          });
        }
      });
  }
});
