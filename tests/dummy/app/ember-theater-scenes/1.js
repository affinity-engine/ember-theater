import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function() {
    this.sound({ id: 'song__bolero' });
    await this.backdrop({ id: 'beach', options: { duration: 1000 } });
    this.backdrop({ id: 'beach', effect: { opacity: 0.5 }, options: { duration: 500 } });
    await this.character({ id: 'steven', effect: { translateX: '50vw', opacity: 1 }, options: { duration: 500 } });
    await this.pause({ duration: 2000 });
    this.character({ id: 'steven', expression: { id: 'steven--jumping', transitionOut: { effect: 'transition.whirlOut', options: { duration: 1000 } }, transitionIn: { effect: 'transition.whirlIn', options: { duration: 1000 } } }});
  }
});
