import Ember from 'ember';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';

import pause from './helpers/pause';

const { Test: { registerAsyncHelper } } = Ember;

registerAsyncHelper('pause', pause);

setResolver(resolver);
