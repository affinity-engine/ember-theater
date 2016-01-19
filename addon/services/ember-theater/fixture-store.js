import Ember from 'ember';

const {
  Service,
  get
} = Ember;

export default Service.extend({
  find(type, id) {
    return get(this, type).findBy('id', id);
  }
});
