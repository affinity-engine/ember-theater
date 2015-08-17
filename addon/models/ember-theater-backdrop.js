import DS from 'ember-data';

const { 
  attr, 
  Model
} = DS;

export default Model.extend({
  componentType: 'ember-theater-stage-backdrop',

  caption: attr('string'),
  intl: attr('boolean'),
  position: attr('string'),
  src: attr('string')
});
