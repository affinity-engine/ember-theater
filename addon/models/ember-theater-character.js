import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
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
