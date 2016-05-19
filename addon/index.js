import ConfigurableMixin from 'ember-theater/mixins/configurable';
import MultitonIdsMixin from 'ember-theater/mixins/multiton-ids';

import configurable, { deepConfigurable, deepArrayConfigurable } from 'ember-theater/macros/ember-theater/configurable';

import animate from 'ember-theater/utils/ember-theater/animate';
import deepMerge from 'ember-theater/utils/ember-theater/deep-merge';
import nativeCopy from 'ember-theater/utils/ember-theater/native-copy';

export {
  ConfigurableMixin,
  MultitonIdsMixin,
  configurable,
  deepConfigurable,
  deepArrayConfigurable,
  animate,
  deepMerge,
  nativeCopy
};
