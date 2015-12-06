import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const { String: { camelize } } = Ember;

export function initialize(application) {
  const textTags = gatherModules('ember-theater\/director\/text-tags');

  textTags.forEach((textTag, textTagName) => {
    application.register(`text-tag:${textTagName}`, textTag, {
      instantiate: false,
      singleton: false
    });
    application.inject('component:ember-theater/director/directable/text/body',
      camelize(textTagName),
      `text-tag:${textTagName}`);
  });
}

export default {
  name: 'ember-theater/director/register-text-tags',
  initialize: initialize
};
