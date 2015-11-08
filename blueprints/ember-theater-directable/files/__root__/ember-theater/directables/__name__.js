import { Directable } from 'ember-theater';

export default Directable.extend({
  componentType: 'ember-theater/directables/<%= dasherizedModuleName %>',
  layer: 'theater.<%= dasherizedModuleName %>'
});
