import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';
import { BusPublisherMixin, BusSubscriberMixin } from 'ember-message-bus';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';

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

export default MultitonService.extend(BusPublisherMixin, BusSubscriberMixin, MultitonIdsMixin, {
  store: service(),

  config: multiton('ember-theater/config', 'theaterId'),

  maxAutosaves: configurable(configurablePriority, 'maxAutosaves'),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:writingAutosave`, this, this.writeAutosave);
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
      this.publish(`et:${theaterId}:saveIsCreating`, '', { isAutosave: true });
    } else {
      const autosave = autosaves.sortBy('updated').get('firstObject');

      this.publish(`et:${theaterId}:saveIsUpdating`, autosave);
    }
  }
});
