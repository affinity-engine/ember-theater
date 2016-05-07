import { MultitonService } from 'ember-multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

export default MultitonService.extend(MultitonIdsMixin, {
  isFocused: null
});
