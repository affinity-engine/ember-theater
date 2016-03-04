import Ember from 'ember';

const { RSVP: { Promise } } = Ember;
const { run: { later } } = Ember;

export default function(app, duration = 0) {
  return new Promise((resolve) => {
    later(() => {
      resolve();
    }, duration);
  });
}
