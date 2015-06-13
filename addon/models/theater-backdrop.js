import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  imageSrc: attr('string'),
  position: attr('string')
  
});
