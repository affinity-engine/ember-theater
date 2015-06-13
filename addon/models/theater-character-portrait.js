import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  character: belongsTo('character'),

  height: attr('number'),
  imageSrc: attr('string'),
  opacity: attr('number')
  
});
