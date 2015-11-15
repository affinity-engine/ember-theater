import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { set } = Ember;

export default TextTag.extend({
  perform(context, index, speed) {
    set(context, 'textSpeed', speed);
    context.writeWord(index + 1);
  }
});
