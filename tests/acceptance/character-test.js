// import Ember from 'ember';
// import { module, test } from 'qunit';
// import startApp from '../../tests/helpers/start-app';

// const characterClass = '.theater-stage__character';
// const addCharacter1Id = '#add_character1';

// let application;

// module('Acceptance | character', {
//   beforeEach() {
//     application = startApp();
//   },

//   afterEach() {
//     Ember.run(application, 'destroy');
//   }
// });

// test('adding a character', (assert) => {
//   preloadImages();

//   visit('/');

//   click(addCharacter1Id);

//   andThen(() => {
//     assert.equal(Ember.$(characterClass).length, 1, 'can add a character');

//     const firstCharacter = Ember.$(characterClass).first();
//     assert.equal(firstCharacter.width(), 310, 'adjusts the width');
//   });

//   click(addCharacter1Id);

//   andThen(() => {
//     assert.equal(Ember.$(characterClass).length, 2, 'can add additional characters');
//   });
// });
