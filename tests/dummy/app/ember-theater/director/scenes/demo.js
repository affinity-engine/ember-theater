import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  start: async function(script) {
    // const value = await script.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);
    //
    // console.log(value);

    // script.Sound('song__bolero').fadeIn();
    // await script.Pause(1000);
    // script.Sound('song__bolero').fadeOut();

    const bebe = await script.Character('bebe').expression('bebe-blush').position('center', 1000).expression('bebe-laughing', { transitionIn: { duration: 1000, effect: 'transition.whirlIn' }, transitionOut: { duration: 1000, effect: 'transition.whirlOut' } }).position('right', 1000).expression('bebe-angry').name('Bebe Prime');
    bebe.position('left', 1000).position('center', 2000).transition('transition.whirlIn', 2000).transition('callout.bounce', 1000);

    const bebe2 = await script.Character('bebe').position('centerLeft', 0);

    await bebe.Text('Default!');
    await bebe.namePosition('right').Text('Right!');
    await bebe.namePosition('center').Text('Center!');
    await bebe.namePosition('left').Text('Left!');

    bebe.expression('bebe-blush');
    bebe2.expression('bebe-laughing');
    await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    await bebe.position('nudgeLeft', 1000).Text('nudgeLeft');
    await bebe.position('nudgeUp', 1000).Text('nudgeUp');
    await bebe.position('nudgeDown', 1000).Text('nudgeDown');
    await bebe.position('nudgeForward', 1000).Text('nudgeForward');
    await bebe.position('nudgeBack', 1000).Text('nudgeBack');

    await bebe.Text('farLeft');
    await bebe.position('left', 1000).Text('left');
    await bebe.position('centerLeft', 1000).Text('centerLeft');
    await bebe.position('center', 1000).Text('center');
    await bebe.position('centerRight', 1000).Text('centerRight');
    await bebe.position('right', 1000).Text('right');
    await bebe.position('farRight', 1000).Text('farRight');
    await bebe.position('offRight', 1000).Text('offRight');
    await bebe.position('center', 1000).position('row2').Text('center row2');


    bebe.position('left').transition({ translateY: '-50%' }, 500).transition({ translateX: '30%' }, 1000, { loop: true });

    await script.Pause(600);

    bebe.stop();

    await script.Pause(1000);

    bebe.position('right').transition({ translateX: '30%' }, 1000, { loop: true });

    await script.Pause(600);

    bebe.stop();

    await script.Pause(1000);

    const classroom = script.Backdrop('classroom').transition({ opacity: 1 }, 500).transition({ translateX: '30%' }, 1000, { loop: true });

    await script.Pause(600);

    classroom.stop();

    await script.Pause(1000);

    classroom.transition({ opacity: 1, translateX: '30%' }, 1000, { loop: true });

    await script.Pause(600);

    classroom.stop();

    await script.Pause(1000);


    await bebe.position('center').transition({ translateY: '-50%' }, 500, { loop: 3 }).name('Bebe?').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a', ' ']).classNames({ name: 'et-right' });
    await script.Text('Bye!');
    await bebe.expression('bebe-blush');
    await bebe.Text('How was that?');

    await classroom.transition('transition.whirlIn');
    script.Filter('theater.stage', ['blur(0px)', 'blur(10px)'], 1000);
    await script.Text('Hello!');
    script.Filter('theater.stage', ['blur(10px)', 'blur(0px)'], 1000).destroy();
    await script.Text('Bye!');

    const choice = await script.Choice(['A', 'B', 'C']);

    console.log(choice);

    script.Text('Hello!');
    await script.Pause(500);
    await script.Text('Bye!');

    await script.Scene('demo').transitionOut('transition.whirlOut', 1000);
  }
});
