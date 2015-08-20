import Ember from 'ember';

const { copy } = Ember;

export default Ember.Object.extend({
  directables: Ember.A(),
  layers: Ember.A(),

  addDirectable(directable) {
    const layers = this.get('layers');
    const layerNames = directable.get('layer').split(/\.|\//);
    const layerName = layerNames[layerNames.indexOf(this.get('name')) + 1];

    if (layerName) {
      let layer = layers.find((layer) => {
        return layer.get('name') === layerName;
      });

      if (!layer) {
        layer = this.constructor.create({
          directables: Ember.A(),
          layers: Ember.A(),
          name: layerName
        });
        layers.pushObject(layer);
      }

      layer.clearSingleton(directable);
      layer.addDirectable(directable);
    } else {
      this.clearSingleton(directable);
      this.get('directables').pushObject(directable);
    }
  },

  clearChildLayers() {
    const layers = this.get('layers');

    layers.forEach((layer) => {
      layer.clearChildLayers();
      layer.clearDirectables();
      layer.destroy();
    });

    layers.clear();
  },

  clearDirectables() {
    const directables = this.get('directables');

    directables.forEach((directable) => {
      directable.destroy();
    });
    directables.clear();
  },

  clearSingleton(directable) {
    if (directable.get('singletonLayer') === this.get('name')) {
      this.clearChildLayers();
    }
  },

  gatherDirectables() {
    return this.get('layers').reduce((directables, layer) => {
      return directables.pushObjects(layer.gatherDirectables());
    }, Ember.A(copy(this.get('directables'))));
  }
});
