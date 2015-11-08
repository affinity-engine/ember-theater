import { Directable } from 'ember-theater';

export default Directable.extend({
  componentType: 'ember-theater/director/choice',
  layer: 'theater.text.choice'
});
