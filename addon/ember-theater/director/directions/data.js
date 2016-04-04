import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const {
  get,
  getProperties,
  isPresent,
  merge,
  set
} = Ember;

export default Direction.extend(BusPublisherMixin, {
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  _setup(dataId) {
    this._entryPoint();

    set(this, 'attrs.dataId', dataId);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super({ actions: Ember.A(), ...getProperties(attrs, 'dataId') });
  },

  delete() {
    get(this, 'actions').pushObject({ event: 'et:main:deletingStateValue', arguments });
  },

  decrement() {
    get(this, 'actions').pushObject({ event: 'et:main:decrementingStateValue', arguments });
  },

  increment() {
    get(this, 'actions').pushObject({ event: 'et:main:incrementingStateValue', arguments });
  },

  set() {
    get(this, 'actions').pushObject({ event: 'et:main:settingStateValue', arguments });
  },

  toggle() {
    get(this, 'actions').pushObject({ event: 'et:main:togglingStateValue', arguments });
  },

  _perform(priorSceneRecord, resolve) {
    if (isPresent(priorSceneRecord)) {
      resolve(priorSceneRecord);
    } else {
      this._performActions();

      const dataId = get(this, 'attrs.dataId');
      const saveStateManager = get(this, 'saveStateManager');

      resolve(saveStateManager.getStateValue(dataId));
    }
  },

  _performActions() {
    const dataId = get(this, 'attrs.dataId');

    get(this, 'actions').forEach(({ event, arguments }) => {
      this.publish(event, dataId, ...arguments);
    });
  }
});
