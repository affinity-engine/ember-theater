import ConfigurableMixin from 'ember-theater/mixins/configurable';
import MultitonIdsMixin from 'ember-theater/mixins/multiton-ids';

import configurable, { deepConfigurable, deepArrayConfigurable } from 'ember-theater/macros/ember-theater/configurable';

import animate from 'ember-theater/utils/ember-theater/animate';
import deepMerge from 'ember-theater/utils/ember-theater/deep-merge';
import gatherTypes from 'ember-theater/utils/ember-theater/gather-types';
import nativeCopy from 'ember-theater/utils/ember-theater/native-copy';

import { initialize as loadTranslations } from 'ember-theater/instance-initializers/ember-theater/load-translations';
import { initialize as initializeConfig } from 'ember-theater/instance-initializers/ember-theater/register-configs';

const initialize = function initialize(appInstance) {
  loadTranslations(appInstance);
  initializeConfig(appInstance);
};

export {
  ConfigurableMixin,
  MultitonIdsMixin,
  configurable,
  deepConfigurable,
  deepArrayConfigurable,
  animate,
  deepMerge,
  gatherTypes,
  nativeCopy,
  initialize
};
