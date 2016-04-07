import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Character Direction Test',

  start: async function(script) {
    const bebe = script.Character('bebe');

    await script.Delay('p');
    bebe.transition({ opacity: 0.2 });

    await script.Delay('p');
    await bebe.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await script.Delay('p');
    const bebe2 = await script.Character('bebe');

    await script.Delay('p');
    await bebe2.transition({ opacity: 0.6 });

    await script.Delay('p');
    await script.Character('blixie');

    await script.Delay('p');
    await script.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpression: 'blixie-neutral'
    });

    await script.Delay('p');
    const bebe3 = await script.Character('bebe').position('center');

    await script.Delay('p');
    await bebe3.position('left nudgeDown');

    await script.Delay('p');
    await script.Character('bebe').initialExpression('bebe-happy').position('center');
  }
});
