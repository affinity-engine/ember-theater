import { Directable } from 'ember-theater';

export default Directable.extend({
  componentType: 'ember-theater/director/character',
  layer: 'theater.stage.foreground.character'
});
