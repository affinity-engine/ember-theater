import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import MultitonDirectionMixin from 'ember-theater/mixins/multiton-direction';

export default EmberTheaterDirection.createWithMixins(MultitonDirectionMixin, {
  perform(line, directables) {
    this.direct(line, directables, 'ember-theater-stage-backdrop');
  }
});
