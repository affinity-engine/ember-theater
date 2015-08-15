import Ember from 'ember';

const {
  inject,
  Route
} = Ember;

export default Route.extend({
  intl: inject.service(),

  beforeModel() {
    this.get('intl').setLocale('en-us');
  }
});
