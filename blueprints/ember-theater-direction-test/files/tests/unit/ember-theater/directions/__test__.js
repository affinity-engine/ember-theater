import <%= camelizedModuleName %> from '<%= dasherizedPackageName %>/ember-theater/directions/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | EmberTheaterDirection | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = <%= camelizedModuleName %>();
  assert.ok(result);
});
