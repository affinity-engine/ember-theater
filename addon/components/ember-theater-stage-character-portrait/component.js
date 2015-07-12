import Ember from 'ember';

const { 
  Component, 
  on 
} = Ember;

export default Component.extend({
  attributeBindings: ['src'],
  classNames: ['ember-theater-stage__portrait'],
  tagName: 'img',

  associatePortraitWithCharacter: on('didInsertElement', function() {
    const character = this.get('character');
    const oldPortrait = character.get('currentPortrait');

    character.setProperties({
      oldPortrait: oldPortrait,
      currentPortrait: this
    });
  })
});
