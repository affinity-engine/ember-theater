import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  start: async function(script) {
    const classroom = script.Backdrop('classroom');

    await script.Pause('p');
    classroom.transition({ opacity: 0.2 });

    await script.Pause('p');
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await script.Pause('p');
    await classroom.caption('foo');

    await script.Pause('p');
    const classroom2 = await script.Backdrop('classroom');

    await script.Pause('p');
    await classroom2.transition({ opacity: 0.6 });

    await script.Pause('p');
    await script.Backdrop('beach-day');

    await script.Pause('p');
    await script.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });

    await script.Pause('p');
    await classroom.transition({ left: '30%' }, 10, { loop: true });
    classroom.stop();
    await script.Pause('p');
  }
});
