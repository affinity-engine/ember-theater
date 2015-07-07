import Ember from 'ember';

const { Mixin, on, run } = Ember;

export default Mixin.create({
  previousLine: null,

  performLine: on('didRender', function() {
    const line = this.get('line');
    if (!this.element || this.get('previousLine') === line) { return; }

    this.set('previousLine', line);
    if (!line.sync) { line.resolve(); }
    run.next(() => {
      if (!this.element) { return; }
      const effect = line.effect ? line.effect : 'transition.fadeIn';
      Ember.$.Velocity.animate(this.element, effect, line.options).then(() => {
        if (line.sync) { line.resolve(); }
      });
    });
  })
});
