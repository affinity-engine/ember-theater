import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  character: belongsTo('ember-theater-character', { inverse: 'portraits' }),

  caption: attr('string'),
  height: attr('number'),
  src: attr('string'),
  opacity: attr('number')
  
});
