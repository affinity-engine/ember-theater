import Ember from 'ember';

const { Mixin, on, observer, run } = Ember;

export default Mixin.create({
  previousLine: null,

  performLine: on('didInsertElement', observer('line', function() {
    const line = this.get('line');
    if (!this.element || this.get('previousLine') === line) { return; }

    this.set('previousLine', line);
    if (!line.sync) { line.resolve(); }
    run.next(() => {
      const effect = line.effect ? line.effect : 'transition.fadeIn';
      $.Velocity.animate(this.element, effect, line.options).then(() => {
        if (line.sync) { line.resolve(); }
      });
    });
  })),
});
