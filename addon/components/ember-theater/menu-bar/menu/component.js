import Ember from 'ember';

import {
  keyUp,
  EKOnInsertMixin
} from 'ember-keyboard';

const {
  Component,
  get,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend(EKOnInsertMixin, {
  config: service('ember-theater/config'),

  setupCancelKeys: on('init', function() {
    const cancelKeys = get(this, 'config.cancelKeys');

    cancelKeys.forEach((key) => this.on(keyUp(key), () => this.attrs.closeMenu()));
  }) 
});
