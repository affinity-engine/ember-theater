import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { run: { later } } = Ember;

export default TextTag.extend({
  perform(context, index, duration) {
    later(() => {
      context.attrs.resolve();
    }, duration || 0);
  }
});
