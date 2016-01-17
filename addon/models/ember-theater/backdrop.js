import DS from 'ember-data';

const {
  attr,
  Model
} = DS;

export default Model.extend({
  caption: attr('string'),
  src: attr('string')
});
