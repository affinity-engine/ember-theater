import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Character Direction Test',

  start: async function(S) {
    const bebe = S.Character('bebe');

    await S.Pause('p');
    bebe.transition({ opacity: 0.2 });

    await S.Pause('p');
    await bebe.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await S.Pause('p');
    const bebe2 = await S.Character('bebe').transition();

    await S.Pause('p');
    await bebe2.transition({ opacity: 0.6 });

    await S.Pause('p');
    await S.Character('blixie').transition();

    await S.Pause('p');
    await S.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpressionId: 'blixie-neutral'
    }).transition();

    await S.Pause('p');
    const bebe3 = await S.Character('bebe').position('center');

    await S.Pause('p');
    await bebe3.position('left nudgeDown');

    await S.Pause('p');
    await S.Character('bebe').initialExpression('bebe-happy').position('center');

    await S.Pause('p');
    await bebe.transition({ left: '30%' }, 10, { loop: true });
    bebe.stop();
    await S.Pause('p');
  }
});
