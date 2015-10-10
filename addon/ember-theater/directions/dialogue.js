import { Direction } from 'ember-theater';

export default Direction.extend({
  componentType: 'ember-theater/director/dialogue',
  layer: 'text.dialogue',
  singletonLayer: 'text'
});
