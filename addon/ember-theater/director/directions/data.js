import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiton from 'ember-multiton-service';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  get,
  getProperties,
  isPresent,
  set
} = Ember;

export default Direction.extend(BusPublisherMixin, {
  saveStateManager: multiton('ember-theater/save-state-manager', 'theaterId'),

  _setup(dataId) {
    this._entryPoint();

    set(this, 'attrs.dataId', dataId);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    set(this, 'actions', Ember.A());

    return this._super({ ...getProperties(attrs, 'dataId') });
  },

  delete(...args) {
    get(this, 'actions').pushObject({ event: `et:${get(this, 'theaterId')}:deletingStateValue`, ...args });
  },

  decrement(...args) {
    get(this, 'actions').pushObject({ event: `et:${get(this, 'theaterId')}:decrementingStateValue`, ...args });
  },

  increment(...args) {
    get(this, 'actions').pushObject({ event: `et:${get(this, 'theaterId')}:incrementingStateValue`, ...args });
  },

  set(...args) {
    get(this, 'actions').pushObject({ event: `et:${get(this, 'theaterId')}:settingStateValue`, ...args });
  },

  toggle(...args) {
    get(this, 'actions').pushObject({ event: `et:${get(this, 'theaterId')}:togglingStateValue`, ...args });
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

    get(this, 'actions').forEach((action) => {
      this.publish(action.event, dataId, ...action.arguments);
    });
  }
});
