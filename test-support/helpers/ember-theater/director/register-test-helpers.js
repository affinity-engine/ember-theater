import Ember from 'ember';
import delay from './delay';
import step from './step';

export default function() {
  Ember.Test.registerAsyncHelper('delay', delay);
  Ember.Test.registerAsyncHelper('step', step);
}
