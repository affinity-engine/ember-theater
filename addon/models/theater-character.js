import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  portraits: hasMany('theater-character-portrait'),

  height: attr('number'),
  name: attr('string'),
  textColor: attr('string'),
  textFont: attr('string'),
  textSpeed: attr('number'),
  textSound: attr('string'),
  walkSpeed: attr('number')
  
});
