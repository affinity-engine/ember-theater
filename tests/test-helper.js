import Ember from 'ember';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';

import delay from './helpers/delay';

const { Test: { registerAsyncHelper } } = Ember;

registerAsyncHelper('delay', delay);

setResolver(resolver);
