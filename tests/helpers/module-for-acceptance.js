import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        Reflect.apply(options.beforeEach, arguments);
      }
    },

    afterEach() {
      destroyApp(this.application);

      if (options.afterEach) {
        Reflect.apply(options.afterEach, arguments);
      }
    }
  });
}
