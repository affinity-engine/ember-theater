import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  start: async function(script) {
    // await script.Text((await script.Random(10)).toString());
    // const result = await script.Text('Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities! Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities! Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities! Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities! Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities! Hey! How are you? I am fine and speaking in full sentences. I know that might not seem exciting to you just now, but imagine the possibilities!').instant().scrollable().classNames(['et-full', 'et-paper']).Menu([{ text: 'Inputable A', inputable: true }, 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B']).classNames(['et-paper', 'et-block']);
    // await script.Menu([{ text: 'Inputable A', inputable: true }, 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B']);
    // console.log(result);
    // script.Character('bebe').position('center').transition('transition.fadeIn');
    // await script.Text('Before!');
    // script.Data('foo').set('bar');
    // script.Data('foo').delete();
    // script.Data('poo').toggle();
    // script.Data('counter').increment(3);
    // script.Data('counter2').decrement(2);
    //
    // console.log(await script.Data('foo'));
    // console.log(await script.Data('poo'));
    // console.log(await script.Data('counter'));
    // console.log(await script.Data('counter2'));
    // await script.Text('After!');
    //
    // script.Scene('demo');
    script.Backdrop('classroom');
    const bitsy = script.Character('bebe').position('center').namePosition('right');
    await bitsy.delay(500).expression('angry').delay(500).expression('happy').delay(500).expression('angry').Text('theaters.welcome.bitsyGreeting');

    const emma = script.Character('blixie').position('offLeft', 0).position('centerLeft', 1000);
    bitsy.delay(100).position('centerRight', 400);
    await emma.Text('theaters.welcome.emmaGreeting');
    //
    // await bitsy.Text('theaters.welcome.bitsyMakeGames');
    // await emma.Text('theaters.welcome.emmaMakeGames');
    //
    // bitsy.expression('bitsy-panic');
    // await bitsy.Text('theaters.welcome.bitsyShock');
    // bitsy.expression('bitsy-laughing');
    // await bitsy.Text('theaters.welcome.bitsyFun');
    // emma.expression('emma-laughing');
    // await emma.Text('theaters.welcome.emmaFun');
    //
    // bitsy.expression('bitsy-happy');
    // emma.expression('emma-neutral');
    // await bitsy.Text('theaters.welcome.bitsyNext');
    // emma.position('offLeft', 1000);
    // bitsy.delay(100).position('offLeft', 1300);
    // const delay3 = script.Delay(100);
    // const delay = await script.Delay(100);
    // const delay2 = await script.Delay(100);
    // const value = await script.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);
    //
    // console.log(value);

    // script.Sound('song__bolero').fadeIn();
    // await script.Delay(1000);
    // script.Sound('song__bolero').fadeOut();

    // await script.Delay('p');

    // await script.Text('alkajsldkfj alksdjf lkasjd lfka sldkf laksjdfl kjs dlfj lasdjf laksj dlfkja sldkfj lasdjf lkasjd lfkja sldfj laksdj flkasj dlfkj alsdjf lasjd lfkja sldkf jlasdjf lajs dlfja sldfj lkasjd lfja sldfj laksj dflja sldfj alsdjf lasjd flajsldfkj alsjd flasj dlfj aslkdj flkasjldfja lsdfj ljkdsalkajsldkfj alksdjf lkasjd lfka sldkf laksjdfl kjs dlfj lasdjf laksj dlfkja sldkfj lasdjf lkasjd lfkja sldfj laksdj flkasj dlfkj alsdjf lasjd lfkja sldkf jlasdjf lajs dlfja sldfj lkasjd lfja sldfj laksj dflja sldfj alsdjf lasjd flajsldfkj alsjd flasj dlfj aslkdj flkasjldfja lsdfj ljkdsalkajsldkfj alksdjf lkasjd lfka sldkf laksjdfl kjs dlfj lasdjf laksj dlfkja sldkfj lasdjf lkasjd lfkja sldfj laksdj flkasj dlfkj alsdjf lasjd lfkja sldkf jlasdjf lajs dlfja sldfj lkasjd lfja sldfj laksj dflja sldfj alsdjf lasjd flajsldfkj alsjd flasj dlfj aslkdj flkasjldfja lsdfj ljkdsalkajsldkfj alksdjf lkasjd lfka sldkf laksjdfl kjs dlfj lasdjf laksj dlfkja sldkfj lasdjf lkasjd lfkja sldfj laksdj flkasj dlfkj alsdjf lasjd lfkja sldkf jlasdjf lajs dlfja sldfj lkasjd lfja sldfj laksj dflja sldfj alsdjf lasjd flajsldfkj alsjd flasj dlfj aslkdj flkasjldfja lsdfj ljkdsalkajsldkfj alksdjf lkasjd lfka sldkf laksjdfl kjs dlfj lasdjf laksj dlfkja sldkfj lasdjf lkasjd lfkja sldfj laksdj flkasj dlfkj alsdjf lasjd lfkja sldkf jlasdjf lajs dlfja sldfj lkasjd lfja sldfj laksj dflja sldfj alsdjf lasjd flajsldfkj alsjd flasj dlfj aslkdj flkasjldfja lsdfj ljkds').textSpeed(100)
    //
    // await script.Character('bebe')
    // script.Layer('theater').filter(['blur(0px)', 'blur(10px)'], 10000)
    // script.Text('Start').textSpeed(100);
    // const menu1 = await script.Menu(['A', 'B']);
    // if (menu1.result.key === 0) {
    //   await script.Scene('child').window('child').classNames(['et-center', 'et-background-light', 'et-shadow-light']).priority(1).screen('et-light');
    // }
    // await script.Text('After').textSpeed(100)
    // await script.Text('alkajsldkfj').textSpeed(100)
    //
    // const bebe = await script.Character('bebe').expression('bebe-blush').position('center', 1000).expression('bebe-laughing', { transitionIn: { duration: 1000, effect: 'transition.whirlIn' }, transitionOut: { duration: 1000, effect: 'transition.whirlOut' } }).position('right', 1000).expression('bebe-angry').name('Bebe Prime');
    // bebe.position('left', 1000).position('center', 2000).expression('bebe-blush').transition('callout.bounce', 1000);
    //
    // const bebe2 = await script.Character('bebe').position('centerLeft', 0);
    //
    // await bebe.Text('Default!');
    // await bebe.namePosition('right').Text('Right!');
    // await bebe.namePosition('center').Text('Center!');
    // await bebe.namePosition('left').Text('Left!');
    //
    // bebe.expression('bebe-blush');
    // bebe2.expression('bebe-laughing');
    // await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    // await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    // await bebe.position('nudgeRight', 1000).Text('nudgeRight');
    // await bebe.position('nudgeLeft', 1000).Text('nudgeLeft');
    // await bebe.position('nudgeUp', 1000).Text('nudgeUp');
    // await bebe.position('nudgeDown', 1000).Text('nudgeDown');
    // await bebe.position('nudgeForward', 1000).Text('nudgeForward');
    // await bebe.position('nudgeBack', 1000).Text('nudgeBack');
    //
    // await bebe.Text('farLeft');
    // await bebe.position('left', 1000).Text('left');
    // await bebe.position('centerLeft', 1000).Text('centerLeft');
    // await bebe.position('center', 1000).Text('center');
    // await bebe.position('centerRight', 1000).Text('centerRight');
    // await bebe.position('right', 1000).Text('right');
    // await bebe.position('farRight', 1000).Text('farRight');
    // await bebe.position('offRight', 1000).Text('offRight');
    // await bebe.position('center', 1000).position('row2').Text('center row2');
    //
    //
    // bebe.position('left').transition({ translateY: '-50%' }, 500).transition({ translateX: '30%' }, 1000, { loop: true });
    //
    // await script.Delay(600);
    //
    // bebe.stop();
    //
    // await script.Delay(1000);
    //
    // bebe.position('right').transition({ translateX: '30%' }, 1000, { loop: true });
    //
    // await script.Delay(600);
    //
    // bebe.stop();
    //
    // await script.Delay(1000);
    //
    // const classroom = script.Backdrop('classroom').transition({ opacity: 1 }, 500).transition({ translateX: '30%' }, 1000, { loop: true });
    //
    // await script.Delay(600);
    //
    // classroom.stop();
    //
    // await script.Delay(1000);
    //
    // classroom.transition({ opacity: 1, translateX: '30%' }, 1000, { loop: true });
    //
    // await script.Delay(600);
    //
    // classroom.stop();
    //
    // await script.Delay(1000);
    //
    //
    // await bebe.position('center').transition({ translateY: '-50%' }, 500, { loop: 3 }).name('Bebe?').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a', ' ']).classNames({ name: 'et-right' });
    // await script.Text('Bye!');
    // await bebe.expression('bebe-blush');
    // await bebe.Text('How was that?');
    //
    // await classroom.transition('transition.whirlIn');
    // script.Filter('theater.stage', ['blur(0px)', 'blur(10px)'], 1000);
    // await script.Text('Hello!');
    // script.Filter('theater.stage', ['blur(10px)', 'blur(0px)'], 1000).destroy();
    // await script.Text('Bye!');
    //
    // const menu = await script.Menu(['A', 'B', 'C']);
    //
    // console.log(menu);
    //
    // script.Text('Hello!');
    // await script.Delay(500);
    // await script.Text('Bye!');
    //
    await script.Scene('demo').transitionOut('transition.whirlOut', 500);
  }
});
