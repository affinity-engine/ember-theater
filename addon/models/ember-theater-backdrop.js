import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  componentType: 'ember-theater-stage-backdrop',

  caption: attr('string'),
  src: attr('string'),
  position: attr('string')
  
});
