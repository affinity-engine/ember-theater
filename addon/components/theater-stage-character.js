import Ember from 'ember';
import layout from '../templates/components/theater-stage-character';
import TheaterStage from './theater-stage';
import WindowResizeMixin from '../mixins/window-resize';

const { Component, on, observer, computed } = Ember;

export default Component.extend(WindowResizeMixin, {
  layout: layout,
  classNames: ['theater-stage__character'],

  // Associates the character and component so that script writers can perform Velocity manipulations
  // off the character.
  associateCharacterWithComponent: on('init', function() {
    this.set('character.actor', this);
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
    this.$('.theater-stage__portrait').each(function() {
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

  defaultDestination: computed('index', 'charactersLength', function() {
    const index = this.get('index');
    const charactersLength = this.get('charactersLength');
    switch (index) {
      case 0: 
        if (charactersLength === 1) {
          return { x: 50, y: 0 };
        } else {
          return { x: 60, y: 10 };
        }
        break;
      case 1: return { x: 40, y: 10 };
      case 2: return { x: 80, y: 0 };
      case 3: return { x: 20, y: 0 };
      case 4: return { x: 100, y: 0 };
      case 5: return { x: 0, y: 0 };
      default: return { x: -20, y: 0 };
    }
  }),

  goToDefaultPosition: observer('defaultDestination', function(options) {
    const destination = this.get('defaultDestination');
    this.walkTo(destination, options);
    this.set('currentX', destination.x);
    this.set('currentY', destination.y);
  }),

  walkTo(destination, options) {
    const percent = this.get('characterWidthPercentage');
    return Ember.$.Velocity.animate(this.$(), {
      translateX: `${destination.x - (percent / 2)}vw`,
      translateY: `${destination.y * -1}vh`
    }, {
      duration: this.translationDuration(destination, options)
    });
  },

  addInitialPortrait: on('didInsertElement', function() {
    const imagePath = this.get('character.imagePath');
    this.set('portraits', Ember.A([imagePath]));
  }),

  translationDuration(destination, options) {
    const speed = options && options.speed !== undefined ? options.speed : this.get('character.speed');
    const xDistance = Math.abs(destination.x - this.get('currentX'));
    const yDistance = Math.abs(destination.y - this.get('currentY'));
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) * speed;
  },

  defaultEnterStageX(enterStage) {
    const percent = this.get('characterWidthPercentage');
    switch (enterStage) {
      case 'left': return -percent;
      case 'right': return 100 + percent;
      case 'bottom': return 50 - (percent / 2);
      case 'top': return 50 - (percent / 2);
    }
  },

  defaultEnterStageY(enterStage) {
    switch (enterStage) {
      case 'left': return 0;
      case 'right': return 0;
      case 'bottom': return -100;
      case 'top': return 100;
    }
  },

  defaultEntry(enterStage) {
    return { x: this.defaultEnterStageX(enterStage), y: this.defaultEnterStageY(enterStage) };
  },

  goToInitialPosition(destination) {
    return this.walkTo(destination, { speed: 0 });
  },

  activateImage() {
    return Ember.$.Velocity.animate(this.$('.theater-stage__portrait').first(), {
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
      this.$('.theater-stage__portrait').each(function() {
        Ember.$.Velocity.animate(Ember.$(this), { opacity: 0 }, options).then(() => {
          portraits.shiftObject();
        });
      });

      portraits.addObject(imagePath);
      Ember.run.later(this, function() {
        this.$('.theater-stage__portrait').last().velocity('fadeIn', options);
      });
    }

  }
});
