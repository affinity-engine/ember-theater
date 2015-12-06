import <%= camelizedModuleName %> from '<%= dasherizedPackageName %>/ember-theater/director/text-tags/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | EmberTheaterTextTag | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = <%= camelizedModuleName %>();
  assert.ok(result);
});
