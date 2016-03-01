import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed,
  get,
  isBlank,
  set
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),

  idMap: computed(() => Ember.Object.create()),

  findOrCreateInstance(soundId, instanceId = 0) {
    const instance = get(this, `idMap.${soundId}.${instanceId}`);

    return instance || this._createInstance(soundId, instanceId);
  },

  _createInstance(soundId, instanceId) {
    const idMap = get(this, 'idMap');

    if (isBlank(get(idMap, soundId))) {
      set(idMap, soundId, Ember.Object.create());
    }

    const instance = createjs.Sound.createInstance(soundId);

    return set(idMap, `${soundId}.${instanceId}`, instance);
  },

  clearSounds() {
    const idMap = get(this, 'idMap');

    Object.keys(idMap).forEach((instanceMap) => {
      Object.keys(instanceMap).forEach((instance) => {
        instance.stop();
      });
    });

    set(this, 'idMap', Ember.Object.create());
  }
});
