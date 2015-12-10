import Ember from 'ember';

const {
  Mixin,
  computed,
  get
} = Ember;

const { Handlebars: { SafeString } } = Ember;

export default Mixin.create({
  attributeBindings: ['style'],

  style: computed('directable.options.style', {
    get() {
      const object = get(this, 'directable.options.style');
      const style = Object.keys(object).map((key) => {
        return `${key}: ${get(object, key)};`;
      }).join(' ');

      return new SafeString(style);
    }
  }).readOnly()
});
