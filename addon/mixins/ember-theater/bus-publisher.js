import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  Mixin,
  get
} = Ember;

export default Mixin.create(MultitonIdsMixin, {
  messageBus: multitonService('ember-theater/message-bus', 'theaterId'),

  publish(name, ...messages) {
    get(this, 'messageBus').publish(name, ...messages);
  }
});
