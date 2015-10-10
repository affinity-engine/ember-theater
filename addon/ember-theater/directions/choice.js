import { Direction } from 'ember-theater';

export default Direction.extend({
  componentType: 'ember-theater/director/choice',
  layer: 'text.choice',
  singletonLayer: 'text'
});
