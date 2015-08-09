import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import SingletonDirectionMixin from 'ember-theater/mixins/singleton-direction';

export default EmberTheaterDirection.createWithMixins(SingletonDirectionMixin, {
  perform(line, directables) {
    this.direct(line, directables, 'ember-theater-stage-choice');
  }
});
