import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  start: async function(S) {
    const classroom = S.Backdrop('classroom');

    await S.Pause('p');
    classroom.transition({ opacity: 0.2 });

    await S.Pause('p');
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await S.Pause('p');
    await classroom.caption('foo');

    await S.Pause('p');
    const classroom2 = await S.Backdrop('classroom');

    await S.Pause('p');
    await classroom2.transition({ opacity: 0.6 });

    await S.Pause('p');
    await S.Backdrop('beach-day');

    await S.Pause('p');
    await S.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });

    await S.Pause('p');
    await classroom.transition({ left: '30%' }, 10, { loop: true });
    classroom.stop();
    await S.Pause('p');
  }
});
