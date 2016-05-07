import Ember from 'ember';

const {
  Component,
  get,
  on,
  set
} = Ember;

export default Component.extend({
  classNames: ['progress-bar'],

  initializeProgressBar: on('didInsertElement', function() {
    const shape = get(this, 'shape');
    const stepSize = 100;

    const options = this.$().extend(get(this, 'options'), {
      step(state, bar) {
        bar.setText((bar.value() * stepSize).toFixed(0));
      }
    });

    const progressBar = new ProgressBar[shape](this.element, options);

    set(this, 'progressBar', progressBar);
  }),

  updateProgress: on('didRender', function() {
    const progress = get(this, 'progress');

    get(this, 'progressBar').animate(progress);
  })
});
