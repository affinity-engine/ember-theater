import Ember from 'ember';

const {
  Mixin,
  get,
  getOwner,
  isBlank,
  merge,
  set,
  setProperties
} = Ember;

const { run: { later } } = Ember;

export default Mixin.create({
  handleDirectable(id, properties, resolve) {
    const directable = get(properties, 'direction.directable');
    const delay = get(properties, 'attrs.delay') || 0;

    later(() => {
      if (isBlank(directable)) {
        this._addNewDirectable(merge(properties, { id, resolve }));
      } else {
        this._updateDirectable(directable, properties, resolve);
      }
    }, delay);
  },

  _addNewDirectable(properties) {
    const Directable = getOwner(this).lookup('directable:main');
    const directable = Directable.create(properties);

    set(get(properties, 'direction'), 'directable', directable);

    this._finalizeNewDirectable(properties, directable);
  },

  _updateDirectable(directable, properties, resolve) {
    const attrs = Ember.$.extend({}, get(directable, 'attrs'), get(properties, 'attrs'));

    setProperties(directable, merge(properties, { resolve, attrs }));
  }
});
