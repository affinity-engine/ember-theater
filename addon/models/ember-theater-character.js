import DS from 'ember-data';

const { 
  attr, 
  belongsTo, 
  hasMany, 
  Model 
} = DS;

export default Model.extend({
  componentType: 'ember-theater-stage-character',

  defaultExpression: belongsTo('ember-theater-character-expression', { inverse: null }),
  expressions: hasMany('ember-theater-character-expression', { inverse: 'character' }),

  height: attr('number'),
  name: attr('string'),
  textStyle: attr('string')
});
