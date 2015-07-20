import Ember from 'ember';

const { 
  Mixin, 
  run 
} = Ember;

export default Mixin.create({
  previousLine: null,

  executeLine() {
    const line = this.get('line');

    if (!this.element || this.get('previousLine') === line) { return; }

    this.set('previousLine', line);

    if (!line.sync) { line.resolve(); }

    run.next(() => {
      // do nothing if the element isn't present or the line is purely a expression change
      if (!this.element || (!line.effect && line.expression)) { return; }

      const effect = line.effect ? line.effect : 'transition.fadeIn';

      Ember.$.Velocity.animate(this.element, effect, line.options).then(() => {
        if (line.sync) { line.resolve(); }
      });
    });
  }
});
