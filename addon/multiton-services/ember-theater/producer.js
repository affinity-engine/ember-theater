import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin } from 'ember-theater';

export default MultitonService.extend(MultitonIdsMixin, {
  isFocused: null
});
