import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Character Direction Test',

  start: async function(script) {
    const bebe = script.Character('bebe');

    await script.Pause('p');
    bebe.transition({ opacity: 0.2 });

    await script.Pause('p');
    await bebe.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await script.Pause('p');
    const bebe2 = await script.Character('bebe').transition();

    await script.Pause('p');
    await bebe2.transition({ opacity: 0.6 });

    await script.Pause('p');
    await script.Character('blixie').transition();

    await script.Pause('p');
    await script.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpressionId: 'blixie-neutral'
    }).transition();

    await script.Pause('p');
    const bebe3 = await script.Character('bebe').position('center');

    await script.Pause('p');
    await bebe3.position('left nudgeDown');

    await script.Pause('p');
    await script.Character('bebe').initialExpression('bebe-happy').position('center');

    await script.Pause('p');
    await bebe.transition({ left: '30%' }, 10, { loop: true });
    bebe.stop();
    await script.Pause('p');
  }
});
