import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  Mixin,
  get
} = Ember;

export default Mixin.create(TheaterIdMixin, {
  messageBus: multitonService('ember-theater/message-bus', 'theaterId'),

  publish(name, ...messages) {
    get(this, 'messageBus').publish(name, ...messages);
  }
});
