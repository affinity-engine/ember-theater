import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import BusSubscriberMixin from 'ember-theater/mixins/bus-subscriber';
import BusPublisherMixin from 'ember-theater/mixins/bus-publisher';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  computed,
  get,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;

const configurablePriority = [
  'config.attrs.autosaveManager',
  'config.attrs.saveStateManager',
  'config.attrs.globals'
];

export default Ember.Object.extend(BusPublisherMixin, BusSubscriberMixin, MultitonIdsMixin, {
  store: service(),

  config: multitonService('ember-theater/config', 'theaterId'),

  maxAutosaves: configurable(configurablePriority, 'maxAutosaves'),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:main:writingAutosave`, this, this.writeAutosave);
  }),

  autosaves: computed({
    get() {
      const theaterId = get(this, 'theaterId');

      return get(this, 'store').query('ember-theater/local-save', {
        theaterId,
        isAutosave: true
      });
    }
  }).readOnly().volatile(),

  writeAutosave: async function() {
    const autosaves = await get(this, 'autosaves');
    const theaterId = get(this, 'theaterId');

    if (get(this, 'maxAutosaves') > get(autosaves, 'length')) {
      this.publish(`et:${theaterId}:main:saveIsCreating`, '', { isAutosave: true });
    } else {
      const autosave = autosaves.sortBy('updated').get('firstObject');

      this.publish(`et:${theaterId}:main:saveIsUpdating`, autosave);
    }
  }
});
