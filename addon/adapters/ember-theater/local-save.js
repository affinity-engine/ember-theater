import { LokiJSAdapter } from 'ember-lokijs';

export default LokiJSAdapter.extend({
  indices: ['isAutosave']
});
