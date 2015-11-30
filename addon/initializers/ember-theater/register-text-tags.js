import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const { String: { camelize } } = Ember;

export function initialize(application) {
  const textTags = gatherModules('ember-theater\/text-tags');

  textTags.forEach((textTag, textTagName) => {
    application.register(`text-tag:${textTagName}`, textTag, { instantiate: false, singleton: false });
    application.inject('component:ember-theater/director/text/body', camelize(textTagName), `text-tag:${textTagName}`);
  });
}

export default {
  name: 'register-text-tags',
  initialize: initialize
};
