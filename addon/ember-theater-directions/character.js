import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import CoreDirectionMixin from 'ember-theater/mixins/core-direction';

export default EmberTheaterDirection.createWithMixins(CoreDirectionMixin, {
  perform(line, directables) {
    this.direct(line, directables, 'ember-theater-stage-character');
  }
});
