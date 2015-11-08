import <%= camelizedModuleName %> from '<%= dasherizedPackageName %>/ember-theater/directables/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | EmberTheaterDirectable | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = <%= camelizedModuleName %>();
  assert.ok(result);
});
