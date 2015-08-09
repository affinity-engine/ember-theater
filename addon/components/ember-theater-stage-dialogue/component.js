import Ember from 'ember';
import layout from './template';
import ResizeAware from 'ember-resize/mixins/resize-aware';

const {
  computed,
  inject,
  merge,
  on
} = Ember;

export default Ember.Component.extend(ResizeAware, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__dialogue'],
  layout: layout,
  store: inject.service(),

  character: computed('line.character', {
    get() {
      return this.get('store').peekRecord('ember-theater-character', this.get('line.character'));
    }
  }).readOnly(),

  didResize() {
    this.set('keyPressCount', 0);
    Ember.$('.ember-theater-stage-dialogue__body').css('top', 0);
  },

  destroyKeyPressWatcher: on('willDestroyElement', function() {
    Ember.$('body').off('keypress.speak');
  }),

  displayName: computed('character.name', 'line.displayName', {
    get() {
      const displayName = this.get('line.displayName');
      return displayName ? displayName : this.get('character.name');
    }
  }).readOnly(),

  setupKeyPressWatcher: on('didInsertElement', function() {
    Ember.$('body').on('keypress.speak', (event) => {
      this._resolveKeyPress(event);
    });
  }),

  _resolveKeyPress(event) {
    if (event.which === 32) {
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
  }
});
