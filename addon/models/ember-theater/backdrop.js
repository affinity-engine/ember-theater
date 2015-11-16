import DS from 'ember-data';

const {
  attr,
  Model
} = DS;

export default Model.extend({
  caption: attr('string'),
  intl: attr('boolean'),
  position: attr('string'),
  src: attr('string')
});
