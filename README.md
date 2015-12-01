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

#### `ember-theater/direction`

The `director` commands a scene through its use of directions. These directions can do everything from playing music to moving characters across the screen to displaying dialogue and choice interfaces. Many of these directions come bundled with Ember Theater, but you can easily make your own as well.

##### `backdrop`

@param id {String} An id corresponding to an `ember-theater/backdrop` model.
@param effect {Object} |optional| |default: { opacity: 1 }| CSS attributes and values.
@param [options] {Object} |optional|
@param [options.duration] {Number} |default: <set in config>| How long the effect takes to resolve.
@return {Promise} Resolves when the effect has completed.

A backdrop is a full-screen image that occupies the lowest-most z-index. It's an excellent place to put pictures of beaches, bedrooms, and other locations your adventure might visit. The `backdrop` method creates a backdrop, by default fading it in. If a backdrop with the provided id is already present, it will alter the backdrop instead.

```js
this.backdrop('beach', { opacity: 0.5 }, { duration: 2000 }); // fades to half opacity over 2 seconds
this.backdrop('office', { duration: 1000 }); // fades to full opacity over 1 second
await this.backdrop('shower'); // fades to full opacity over the default transition duration
this.backdrop('shower', { opacity: 0 }); // fades out the shower backdrop
```

##### `character`

@param id {String,Object} An id corresponding to an `ember-theater/character` or an object containing both a character id and an expression id.
@param effect {Object} |optional| |default: { opacity: 1 }| CSS attributes and values.
@param [options.duration] {Number} |default: <set in config>| How long the effect takes to resolve.
@return {Promise} Resolves when the effect has completed.

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
```

##### `expression`

##### `text`

##### `choice`

##### `sound`

##### `pause`

##### `filter`

##### `transitionToScene`

##### `setData`

##### `getData`

##### `deleteData`
