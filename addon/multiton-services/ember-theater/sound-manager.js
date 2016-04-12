import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/bus-subscriber';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  computed,
  get,
  isBlank,
  on,
  set
} = Ember;

export default Ember.Object.extend(BusSubscriberMixin, MultitonIdsMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),

  idMap: computed(() => Ember.Object.create()),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:main:reseting`, this, this.clearSounds);
  }),

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

    Object.keys(idMap).forEach((mapKey) => {
      const map = get(idMap, mapKey);

      Object.keys(map).forEach((instanceKey) => {
        get(map, instanceKey).stop();
      });
    });

    set(this, 'idMap', Ember.Object.create());
  }
});
