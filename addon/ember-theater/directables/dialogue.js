import { Directable } from 'ember-theater';

export default Directable.extend({
  componentType: 'ember-theater/director/dialogue',
  layer: 'theater.text.dialogue'
});
