import Directable from 'ember-theater/ember-theater/directable';

export function initialize(container, application) {
  application.register('directable:main', Directable, { singleton: false, instantiate: false });
}

export default {
  name: 'register-directable',
  initialize: initialize
};
