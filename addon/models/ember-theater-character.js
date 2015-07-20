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
  textColor: attr('string'),
  textFont: attr('string'),
  textSpeed: attr('number'),
  textSound: attr('string'),
  walkSpeed: attr('number')
});
