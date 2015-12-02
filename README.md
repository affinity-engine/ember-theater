[![Build Status](https://travis-ci.org/ember-theater/ember-theater.svg?branch=master)](https://travis-ci.org/ember-theater/ember-theater)

# ember-theater

A modular, extensible game engine build on top of Ember.js.

## Installation

`ember install ember-theater`

## Producer-Level Components

The producer is responsible for coordinating the high-level components of your game. You can specify what these components are in your `ember-theater/config.js` file:

```js
export default {
  initial: {
    components: [
      'ember-theater/director',
      'ember-theater/menu-bar'
    ]
  }
}
```

Any components you specify in the config will be concurrently rendered by Ember Theater. The Ember Theater team maintains several of these, but you can also create your own producer-level components and specify them here. The Ember Theater supported components include `ember-theater/director` and `ember-theater/menu-bar`.

### `ember-theater/menu-bar`

The `menu-bar` is an interface for meta-game activities, such as saving, loading, changing settings, or looking at achievements and scores. You can create your own menu-bar interfaces, as well as use the ones that come baked into Ember Theater. These include `save`, `load`, `reset`, and `rewind`.

#### Configuration

You can configure your menu bar layout in the `ember-theater/config.js` file:

```js
export default {
  initial: {
    emberTheaterMenuBar: [
      'ember-theater/menu-bar/rewind',
      'ember-theater/menu-bar/load',
      'ember-theater/menu-bar/save',
      'ember-theater/menu-bar/reset'
    ]
  }
};
```

You can further configure the key bindings that activate the various buttons:

```js
export default {
  menuBar: {
    load: {
      keys: {
        open: ['ctrl+l']
      }
    },
    reset: {
      keys: {
        open: ['ctrl+r']
      }
    },
    rewind: {
      keys: {
        open: ['ctrl+b']
      }
    },
    save: {
      keys: {
        open: ['ctrl+s']
      }
    }
  }
};
```

#### Baked-in Buttons

##### `ember-theater/menu-bar/save`

The save button opens a menu from which the player can save their progress, either overwriting existing games or creating new ones.

##### `ember-theater/menu-bar/load`

The load button open a menu from which the player can load a previous save.

##### `ember-theater/menu-bar/reset`

The reset button returns the player to the very beginning of the game.

##### `ember-theater/menu-bar/rewind`

The rewind button lets the player rewind to a previous scene, regardless of whether or not they had saved there.

### `ember-theater/director`

The `director` is responsible for reading scene scripts and coordinating components both on-stage and off-stage with its directions.

#### `ember-theater/scene`

Scenes can be generated with:

`ember g ember-theater-scene scene-name`

(where `scene-name` is the name of your scene, ideally dasherized)

Scenes have two properties:

##### `name`

If present, the scene `name` will appear in user-facing descriptions of a scene, such as a save game. If not present, the scene's id will be used instead.

##### `script`

The `director`'s primary responsibility is to read scene `script`s. Scripts contain lines of directions, which effect actions both on and off stage. For example, the following script will fade in a backdrop (over the course of one second) and then present a line of text:

```js
script: async function() {
  await this.backdrop('beach', { duration: 1000 });
  this.text('Hello, and welcome to my beach game.');
}
```

Note that [async functions](https://jakearchibald.com/2014/es7-async-functions/) can make the scripts easier to read than plain promises.

#### Configuration

You can configure many of the Ember Theater default values in `ember-theater/config` file:

```js
export default {
  globals: {
    classNames: ['et-block', 'et-paper'], // the default class names applied to dialogue and choice
    speed: 300, // the speed at which text is written
    transitionDuration: 200, // the speed at which dialogue, characters, backdrops, and other fade in and out
    keys: {
      accept: [' ', 'Enter'],
      cancel: ['Escape'],
      moveDown: ['ArrowDown', 's'],
      moveUp: ['ArrowUp', 'w']
    }
  },
  director: {
    transitionDuration: 750 // the speed at which scenes transition
  }
};
```

#### `ember-theater/direction`

The `director` commands a scene through its use of directions. These directions can do everything from playing music to moving characters across the screen to displaying dialogue and choice interfaces. Many of these directions come bundled with Ember Theater, but you can easily make your own as well.

##### `backdrop`

```
@param id {String} An id corresponding to an `ember-theater/backdrop` model.
@param effect {Object} |optional| |default: { opacity: 1 }| CSS attributes and values.
@param [options] {Object} |optional|
@param [options.duration] {Number} |default: <set in config>| How long the effect takes to resolve.
@return {Promise} Resolves when the effect has completed.
```

A backdrop is a full-screen image that occupies the lowest-most z-index. It's an excellent place to put pictures of beaches, bedrooms, and other locations your adventure might visit. The `backdrop` method creates a backdrop, by default fading it in. If a backdrop with the provided id is already present, it will alter the backdrop instead.

```js
this.backdrop('beach', { opacity: 0.5 }, { duration: 2000 }); // fades to half opacity over 2 seconds
this.backdrop('office', { duration: 1000 }); // fades to full opacity over 1 second
await this.backdrop('shower'); // fades to full opacity over the default transition duration
this.backdrop('shower', { opacity: 0 }); // fades out the shower backdrop
```

##### `character`

```
@param id {String,Object} An id corresponding to an `ember-theater/character` or an object containing both a character id and an expression id.
@param effect {Object} |optional| |default: { opacity: 1 }| CSS attributes and values.
@param [options] {Object} |optional|
@param [options.duration] {Number} |default: <set in config>| How long the effect takes to resolve.
@return {Promise} Resolves when the effect has completed.
```

A character is an on-screen representation of an `ember-theater/character` model. It can move about the screen and change its expression. The `character` method creates a character, by default fading it in to the bottom left corner. If a character with the provided id is already present, it will alter the character instead.

```js
// fades to full opacity and moves the character to the horizontal center of the screen
this.character('steven', { translateX: '50vw', opacity: 1 }, { duration: 1000 });
// fades to full opacity and moves the character to the horizontal center,
// starting from the bottom right of the screen
this.character('connie', { translateX: ['100vw', '50vw'], opacity: 1 }, { duration: 1000 });
// fades to full opacity over 1 second, remaining in the bottom left corner of the screen
this.character('garnet', { duration: 2000 });
// fades to full opacity over the default transition duration, remaining in the bottom left
await this.character('pearl');
// fades out the character pearl
this.character('pearl', { opacity: 0 });
// fades to full opacity over the default transition duration, using amethyst's annoyed expression
this.character({ id: 'amethyst', expression: 'annoyed' });
```

##### `expression`

```
@param characterId {String} An id corresponding to an `ember-theater/character`.
@param expressionId {String} An id corresponding to an `ember-theater/character-expression`.
@param [transitionIn] {Object} |optional| Instructs the transition-in effect.
@param [transitionIn.effect] {Object} |default: { opacity: 1 }| The transition-in effect.
@param [transitionIn.duration] {Number} |default: <set in config>| How long the transition-in effect takes to resolve.
@param [transitionOut] {Object} |optional| Instructs the transition-out effect.
@param [transitionOut.effect] {Object} |default: { opacity: 0 }| The transition-out effect.
@param [transitionOut.duration] {Number} |default: <set in config>| How long the transition-out effect takes to resolve.
@return {Promise} Resolves when the transition-in effect has completed.
```

Characters might have many different expressions, ranging from neutral to happy to jumping to wounded. They have a `defaultExpression`, but you can also manually specify an expression with the `character` method. Once the character is on stage, you can also change her expression with the `expression` method. By default, the old expression will fade out while the new one fades in over it. You can change this effect by passing in custom `transitionIn` and `transitionOut` options.

```js
// first, bring the character in with his defaultExpression
await this.character('steven');
// change steven's expression from the defaultExpression to `happy`, using the default transitionIn and transitionOut
await this.expression('steven', 'happy');
// change steven's expression from `happy` to `sad`, using the default transitionOut but a custom transitionIn that drops the new expression in from the top of the screen to the current location
await this.expression('steven', 'sad', { effect: { transitionY: ['100vh', '0vh' }, duration: 1000 });
// change steven's expression from `sad` to `happy`, using both a custom transitionIn and transitionOut
this.expression('steven', 'happy', { effect: { opacity: 1 } }, { effect: { transitionY: '-100vh' } });
```

##### `text`

```
@param characterId {String} |optional| An id corresponding to an `ember-theater/character`.
@param text {String} The text that will appear in the text box.
@param [options] {Object} |optional|
@param [options.instant] {Boolean} |optional| If true, text will appear immediately rather than written out letter by letter
@param [options.displayName] {String} |optional| Overrides the character's name, if present.
@param [options.speed] {Number} |optional| The speed (in milliseconds) at which the letters are written.
@param [options.classNames] {Array} |optional| Class names to change the style of the text.
@param [options.keys.accept] {Array} |optional| Keys that, when pressed, will advance the text.
@return {Promise} Resolves when the text has been displayed in full and a key is pressed.
```

Characters speak and narrators narrate. In either case, words need to be written out for the player. The `text` method does this, writing text to the screen. By default, the text fades in letter-by-letter, and if the text overflows the text window, it will stop writing until a key is pressed, then proceed from that point. The name of the character appears in the window alongside her text.

```js
// displays text with no name
await this.text('Hello world');
// displays text along with the name of the character model (note, this is not necessarily 'Steven')
await this.text('steven', 'Hello, my name is Steven.');
// displays text with no name at a really slow rate of 2 characters a second
await this.text('Hello again, world', { speed: 500 });
// displays text along with the name Tiger Millionaire
await this.text('steven', 'Or am I . . . Tiger Millionaire!!!', { displayName: 'Tiger Millionaire' });
```

There are also many special text commands documented here. You can insert them into your text with a `#{}`:

```js
this.text('Sometimes, you have to #{speed 1000} speak real slow.');
```

##### `choice`

```
@param header {String} |optional| A prompt for the choices.
@param choices {Array} The options available to the user to choose from.
@param [options] {Object} |optional|
@param [options.keys.moveUp] {Array} |optional| Keys that move the focus up.
@param [options.keys.moveDown] {Array} |optional| Keys that move the focus down.
@param [options.keys.cancel] {Array} |optional| Keys that cancel an inputable choice.
@return {Promise} Resolves when a choice has been selected, passing an object with format { key, text, input }
```

Through the game, you might want to present the player with menu-style choices. These choices could range from responses in conversation to which item they want to purchase at a store. The `choice` method presents them with a list of choices and returns a promise containing the value of their choice. The list of choices can be navigated with `moveUp` and `moveDown` keys, and some choices can be made inputable, so that when they are clicked, they transform into input fields.

```js
// presents three choices; if the user selects 'B', then the promise will return { key: 1, text: 'B' }
const firstChoice = await this.choice(['A', 'B', 'C']);
// same as above, only with a header
const secondChoice = await this.choice('Choose a letter', ['A', 'B', 'C']);
// same as above, only if the user selects 'B', then the promise will return { key: 'customKey', text: 'B' }
const thirdChoice = await this.choice('Choose a letter', ['A', { text: 'B', key: 'customKey' }, 'C']);
// a choice with custom key bindings
const fourthChoice = await this.choice(['Okay', 'Cancel'], { keys: { moveUp: ['a'], moveDown: ['s'] } });
// if the user selects the third option, it will become an input field; if they enter 'Garnet', then the promise will return { key: 2, text: 'Custom', input: 'Garnet' }
const fifthChoice = await this.choice('What is your name?', ['Steven', 'Connie', { text: 'Custom', inputable: true }]);
```

If you want, you can also pass arbitrary data into a choice, and that data will be in the object returned by the promise:

```js
const choiceA = { foo: 'bar' };
const choiceB = 'Some String';
const choice = await this.choice([{ text: 'A', someKey: choiceA }, { text: 'B', anotherKey: choiceB }]);
```

##### `sound`

```
@param id {String} An id associated with an `ember-theater/sound`.
@param effect {String} |optional| An effect, including play, pause, stop, fadeIn, and fadeOut.
@param options {Object} |optional| Arguments you might want to pass to the effect.
@return {Promise} Resolves when the sound finishes playing.
```

Sounds can range from music to sound effects to voice overs.

##### `pause`

```
@return {Promise} Resolves when the duration has elapsed or one of the provided keys is pressed.
```

A pause momentarily disrupts the flow of the scene, preventing future directions from carrying out. Note that if a previous direction is in the process of playing out (such as a backdrop in the process of fading in), it will continue doing so.

```js
// pauses the scene for one second
await this.pause(1000);
// pauses the scene until the enter key or ctrl+shift+a is pressed
await this.pause('Enter', 'ctrl+shift+a');
// pauses the scene until the enter key or ctrl+shift+a is pressed, or until a second passes--whichever comes first
await this.pause('Enter', 'ctrl+shift+a', 1000);
```

##### `transitionToScene`

```
@param sceneId {String} An id associated with an `ember-theater/scene`.
@param [options] {Object} |optional|
@param [options.autosave] {Boolean} |optional| |default: true| When true, overwrites the autosave upon the start of the scene.
```

A scene could be anything from a conversation on the beach to a visit the store to a random battle. Scenes can be reusable or one-shots. To move from one scene to another, use the `transitionToScene` method. Note that as soon as the scene transitions, all subsequent directions in the current scene will be aborted.

```js
if (goingToTheBeach) {
  // transitions to the beach scene
  this.transitionToScene('beach');
} else {
  // transition to the secret-menu scene, but do not autosave in the process
  this.transitionToScene('secret-menu', { autosave: false });
}
```

##### `setData`

```
@param key {String} The key by which you'll look up the data.
@param value {} The value to assign to the key.
```

You'll often want to remember what choices the player made. You can commit data to the game's memory, which will persist between scenes and reloads. You can pass in any arbitrary information you consider valuable, from player stats to meta-data about the play session.

```js
const { input: chosenName } = await this.choice('What is your name?', { inputable: true });
this.setData('playerName', chosenName);

// later, you can overwrite data
this.setData('playerName', newName);
```

##### `getData`

```
@param key {String} The key of the data you're looking up.
```

After saving data, you can look it up again with `getData`:

```js
const playerName = this.getData('playerName');
```

##### `deleteData`

```
@param key {String} The key of the data you want to delete.
```

After saving data, you can optionally remove it with `deleteData`:

```js
this.deleteData('playerName');

const playerName = this.getData('playerName'); // playerName === undefined
```
