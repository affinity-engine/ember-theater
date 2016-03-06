import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  script: async function() {
    const classroom = this.Backdrop('classroom');

    await this.Pause('p');
    classroom.transition({ opacity: 0.2 });

    await this.Pause('p');
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await this.Pause('p');
    await classroom.caption('foo');

    await this.Pause('p');
    const classroom2 = await this.Backdrop('classroom');

    await this.Pause('p');
    await classroom2.transition({ opacity: 0.6 });

    await this.Pause('p');
    await this.Backdrop('beach-day');

    await this.Pause('p');
    await this.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });

    await this.Pause('p');
    await classroom.transition({ left: '30%' }, 10, { loop: true });
    classroom.stop();
    await this.Pause('p');
  }
});
