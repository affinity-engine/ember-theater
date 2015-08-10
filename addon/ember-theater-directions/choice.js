import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import SingletonDirectionMixin from 'ember-theater/mixins/singleton-direction';

export default EmberTheaterDirection.createWithMixins(SingletonDirectionMixin, {
  pseudoChannels: ['text'],
  componentType: 'ember-theater-stage-choice',

  perform(line, directables) {
    this.direct(line, directables);
  }
});
