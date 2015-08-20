import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

export default EmberTheaterDirection.extend({
  componentType: 'ember-theater-directable-dialogue',
  layer: 'text.dialogue',
  singletonLayer: 'text'
});
