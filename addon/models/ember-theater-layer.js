import Ember from 'ember';

const { 
  computed,
  copy
} = Ember;

export default Ember.Object.extend({
  directions: computed(() => Ember.A()),
  layers: computed(() => Ember.A()),

  addChildLayer(layerName, direction) {
    const layers = this.get('layers');
    let layer = layers.find((layer) => {
      return layer.get('name') === layerName;
    });

    if (!layer) {
      // `direction` and `layers` need to be reset or they'll leak into other layers
      layer = this.constructor.create({
        directions: Ember.A(),
        layers: Ember.A(),
        name: layerName
      });
      layers.pushObject(layer);
    }

    layer.clearSingleton(direction);
    layer.addDirection(direction);
  },

  addDirection(direction) {
    const layerNames = direction.get('layer').split(/\.|\//);
    const nextLayer = layerNames[layerNames.indexOf(this.get('name')) + 1];

    if (nextLayer) {
      this.addChildLayer(nextLayer, direction);
    } else {
      this.clearSingleton(direction);
      this.get('directions').pushObject(direction);
    }
  },

  clearChildLayers() {
    const layers = this.get('layers');

    layers.forEach((layer) => {
      layer.clearChildLayers();
      layer.clearDirections();
      layer.destroy();
    });

    layers.clear();
  },

  clearDirections() {
    const directions = this.get('directions');

    directions.forEach((direction) => {
      direction.destroy();
    });
    directions.clear();
  },

  clearSingleton(direction) {
    if (direction.get('singletonLayer') === this.get('name')) {
      this.clearChildLayers();
    }
  },

  gatherDirections() {
    return this.get('layers').reduce((direction, layer) => {
      return direction.pushObjects(layer.gatherDirections());
    }, Ember.A(copy(this.get('directions'))));
  }
});
