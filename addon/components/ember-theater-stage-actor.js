import Ember from 'ember';
import layout from '../templates/components/ember-theater-stage-actor';
import TheaterStage from './ember-theater-stage';
import WindowResizeMixin from '../mixins/window-resize';

const { Component, computed, on, run } = Ember;

export default Component.extend(WindowResizeMixin, {
  layout: layout,
  classNames: ['ember-theater-stage__character'],
  portraits: Ember.A([]),

  // Associates the character and component so that script writers can perform Velocity manipulations
  // off the character.
  associateCharacterWithComponent: on('init', function() {
    this.set('character.component', this);
  }),

  handleWindowResize: on('windowResize', function() {
    this.adjustStageSize();
    this.adjustImageSizes();
    this.repositionAfterResize();
  }),

  adjustStageSize: on('didInsertElement', function() {
    const stage = this.nearestOfType(TheaterStage).$();
    this.set('stageWidth', stage.width());
    this.set('stageHeight', stage.height());
  }),

  adjustImageSizes() {
    const height = this.get('character.height');
    const stageHeight = this.get('stageHeight');
    const imgHeight = height * stageHeight / 100;

    let largestWidth = 0;
    this.$('.ember-theater-stage__portrait').each(function() {
      const $img = Ember.$(this);
      const ratio = imgHeight / $img.prop('naturalHeight');
      const width = $img.prop('naturalWidth') * ratio;
      if (width > largestWidth) { largestWidth = width; }
      $img.width(width);
    });

    this.set('width', largestWidth);
    this.$().width(largestWidth);
  },

  repositionAfterResize() {
    const destination = { x: this.get('currentX'), y: this.get('currentY') };
    this.walkTo(destination);
  },

  characterWidthPercentage: computed('width', 'stageWidth', function() {
    const characterWidth = this.get('width');
    const stageWidth = this.get('stageWidth');
    return characterWidth / stageWidth * 100;
  }),

  addInitialPortrait: on('didInsertElement', function() {
    const src = this.get('character.defaultPortrait.src');
    const height = this.get('character.height');
    this.$().height(`${height}vh`);
    this.get('portraits').pushObject(src);
    run.later(() => {
      this.adjustImageSizes();
    });
  }),

  translationDuration(destination, options) {
    const speed = options && options.speed !== undefined ? options.speed : this.get('character.speed');
    const xDistance = Math.abs(destination.x - this.get('currentX'));
    const yDistance = Math.abs(destination.y - this.get('currentY'));
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) * speed;
  },

  activateImage() {
    return Ember.$.Velocity.animate(this.$('.ember-theater-stage__portrait').first(), {
      opacity: 100
    }, 0);
  },

  actions: {

    enter(enterStage, options) {
      const height = this.get('character.height');
      this.$().height(`${height}vh`);
      this.adjustImageSizes();

      enterStage = typeof enterStage === 'string' ? this.defaultEntry(enterStage) : enterStage;
      this.set('currentX', enterStage.x);
      this.set('currentY', enterStage.y);

      this.goToInitialPosition(enterStage).then(Ember.run.bind(this, this.activateImage))
        .then(() => {
          this.goToDefaultPosition(options);
        });
    },

    changePortrait(imagePath, options) {
      const portraits = this.get('portraits');
      this.$('.ember-theater-stage__portrait').each(function() {
        Ember.$.Velocity.animate(Ember.$(this), { opacity: 0 }, options).then(() => {
          portraits.shiftObject();
        });
      });

      portraits.addObject(imagePath);
      Ember.run.later(this, function() {
        this.$('.ember-theater-stage__portrait').last().velocity('fadeIn', options);
      });
    }

  }
});
