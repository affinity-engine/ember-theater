import DS from 'ember-data';

const { 
  attr, 
  belongsTo, 
  Model 
} = DS;

export default Model.extend({
  character: belongsTo('ember-theater-character', { inverse: 'expressions' }),

  caption: attr('string'),
  height: attr('number'),
  intl: attr('boolean'),
  opacity: attr('number'),
  src: attr('string')
});
