import { Direction } from 'ember-theater';

export default Direction.extend({
  componentType: 'ember-theater/director/<%= dasherizedModuleName %>',
  layer: '<%= dasherizedModuleName %>'

  /**
    If defined, will execute its own code rather than appending a component to the theater.

    @method perform
    @public
  */

  // perform() {}
});
