import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        Reflect.apply(options.beforeEach, this, arguments);
      }
    },

    afterEach() {
      if (options.afterEach) {
        Reflect.apply(options.afterEach, this, arguments);
      }

      destroyApp(this.application);
    }
  });
}
