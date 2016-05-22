export function initialize(appInstance) {
  appInstance.registerOptionsForType('ember-theater/config', { instantiate: false });
}

export default {
  name: 'ember-theater/register-configs',
  initialize
};
