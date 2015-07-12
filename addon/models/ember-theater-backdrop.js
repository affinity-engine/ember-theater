import DS from 'ember-data';

const { 
  attr, 
  Model
} = DS;

export default Model.extend({
  componentType: 'ember-theater-stage-backdrop',

  caption: attr('string'),
  position: attr('string'),
  src: attr('string')
});
