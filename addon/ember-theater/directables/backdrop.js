import { Directable } from 'ember-theater';

export default Directable.extend({
  componentType: 'ember-theater/director/backdrop',
  layer: 'theater.stage.background.backdrop'
});
