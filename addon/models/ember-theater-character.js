import DS from 'ember-data';

const { 
  attr, 
  belongsTo, 
  hasMany, 
  Model 
} = DS;

export default Model.extend({
  componentType: 'ember-theater-stage-character',

  defaultPortrait: belongsTo('ember-theater-character-portrait', { inverse: null }),
  portraits: hasMany('ember-theater-character-portrait', { inverse: 'character' }),

  height: attr('number'),
  name: attr('string'),
  textColor: attr('string'),
  textFont: attr('string'),
  textSpeed: attr('number'),
  textSound: attr('string'),
  walkSpeed: attr('number')
});
