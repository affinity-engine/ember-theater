import Ember from 'ember';
import ENV from '../config/environment';

const { Controller, observer, on } = Ember;

export default Controller.extend({
  isDay: true,
  srcs: ENV.imageSrcs,

  characters: Ember.A(),

  checkForLoadCompletion() {
    this.incrementProperty('loadedImages');
    if (this.get('loadedImages') >= this.get('srcs').length) {
      this.set('imagesLoaded', true);
    }
  },

  preloadImages: on('init', function() {
    if (ENV.environment === 'test') { this.set('imagesLoaded', true); }
    else {
      this.get('srcs').forEach((src) => {
        const _this = this;
        const image = new Image();
        image.src = `images/${src}`;
        image.onload = function() {
          _this.checkForLoadCompletion();
        };
      });
    }
  }),

  background: Ember.Object.create({
    imagePath: 'images/background-beach--day.jpg'
  }),

  toggleBackgroundTime: observer('isDay', function() {
    const time = this.get('isDay') ? 'day' : 'night';
    this.set('background.imagePath', `images/background-beach--${time}.jpg`);
  }),

  actions: {
    cycleDay() {
      this.toggleProperty('isDay');
    },

    addSteven() {
      this.toggleProperty('stevenIsJumping');
      const imagePath = this.get('stevenIsJumping') ? 'images/character-steven--jumping.png' : 'images/character-steven--standing.png';
      const characters = this.get('characters');
      const steven = characters.find((character) => {
        return character.get('name') === 'Steven';
      });
      if (steven) {
        steven.get('actor').send('changePortrait', imagePath);
      } else {
        const character = Ember.Object.create({
          name: 'Steven',
          imagePath: imagePath,
          height: 55,
          speed: 40
        });
        characters.addObject(character);
        Ember.run.later(() => { character.get('actor').send('enter', 'left'); });
      }
    },

    addConnie() {
      const characters = this.get('characters');
        const character = Ember.Object.create({
        name: 'Connie',
        imagePath: 'images/character-connie.png',
        height: 65,
        speed: 30
      });
      characters.addObject(character);
      Ember.run.later(() => { character.get('actor').send('enter', 'right', { speed: 10 }); });
    },

    addGarnet() {
      const characters = this.get('characters');
      const garnet = characters.find((character) => {
        return character.get('name') === 'Garnet';
      });
      if (!garnet) {
        const character = Ember.Object.create({
          name: 'Garnet',
          imagePath: 'images/character-garnet.png',
          height: 85,
          speed: 50
        });
        characters.addObject(character);
        Ember.run.later(() => { character.get('actor').send('enter', 'top'); });
      }
    }
  }
});
