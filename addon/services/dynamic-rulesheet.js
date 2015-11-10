import Ember from 'ember';

const {
  A,
  Service,
  computed,
  get,
  guidFor,
  on,
  set
} = Ember;
const { Object: { create } } = Ember;

export default Service.extend({
  rulesheets: computed(() => A()),

  initializeStylesheet: on('init', function() {
    set(this, 'stylesheet', document.styleSheets[0]);
  }),

  deleteRule(rule) {
    const rulesheets = get(this, 'rulesheets');
    const index = rulesheets.indexOf(rule);

    if (index < 0) { return; }

    rulesheets.removeAt(index);
    get(this, 'stylesheet').deleteRule(index);
  },

  insertRule(rule) {
    get(this, 'stylesheet').insertRule(rule, 0);
    get(this, 'rulesheets').unshiftObject(rule);
  }
});
