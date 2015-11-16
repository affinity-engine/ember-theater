import <%= camelizedModuleName %> from '<%= dasherizedPackageName %>/ember-theater/scenes/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | EmberTheaterScene | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = <%= camelizedModuleName %>();
  assert.ok(result);
});
