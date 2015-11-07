import Ember from 'ember';
import animate from 'ember-theater/utils/animate';

const { 
  merge,
  Mixin, 
  run 
} = Ember;

export default Mixin.create({
  executeLine() {
    const line = this.get('line');
    const options = line.options || {};

    if (this.get('fastboot')) {
      merge(options, { duration: 0 });
    }
    
    run.next(() => {
      // do nothing if the element isn't present or the line is purely a expression change
      // if (!this.element || (!line.effect && line.expression)) { return; }

      const effect = line.effect ? line.effect : 'transition.fadeIn';

      animate(this.element, effect, options).then(() => {
        this.get('line.resolve')();
      });
    });
  }
});
