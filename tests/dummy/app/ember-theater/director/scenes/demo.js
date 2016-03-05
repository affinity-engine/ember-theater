import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  script: async function() {
    // const value = await this.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);
    //
    // console.log(value);

    this.Sound('song__bolero').fadeIn();
    await this.Pause(1000);
    this.Sound('song__bolero').fadeOut();

    this.Character('bebe').instance(3).position('offLeft', 0).position('farLeft farBehind', 3000);
    this.Character('bebe').instance(2).position('offLeft', 0).position('farLeft behind', 2000);
    this.Character('bebe').instance(1).position('offLeft', 0).position('farLeft middleBehind', 1000);
    this.Character('bebe').position('offLeft', 0).position('farLeft high', 1000);
    this.Character('bebe').instance(4).position('offLeft', 0).position('farLeft middleAhead', 1000);
    this.Character('bebe').instance(5).position('offLeft', 0).position('farLeft ahead', 2000);
    this.Character('bebe').instance(6).position('offLeft', 0).position('farLeft farAhead', 3000);
    await this.Character('bebe').Text('farLeft');
    await this.Character('bebe').position('left', 1000).Text('left');
    await this.Character('bebe').position('centerLeft', 1000).Text('centerLeft');
    await this.Character('bebe').position('center', 1000).Text('center');
    await this.Character('bebe').position('centerRight', 1000).Text('centerRight');
    await this.Character('bebe').position('right', 1000).Text('right');
    await this.Character('bebe').position('farRight', 1000).Text('farRight');
    await this.Character('bebe').position('offRight', 1000).Text('offRight');
    await this.Character('bebe').position('center', 1000).position('row2').Text('center row2');


    this.Character('bebe').initialExpression('bebe-laughing').position('left').transition({ translateY: '-50%' }, 500).transition({ translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    this.Character('bebe').stop();

    await this.Pause(1000);

    this.Character('bebe').position('right').transition({ translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    this.Character('bebe').stop();

    await this.Pause(1000);

    this.Backdrop('classroom').transition({ opacity: 1 }, 500).transition({ translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    this.Backdrop('classroom').stop();

    await this.Pause(1000);

    this.Backdrop('classroom').transition({ opacity: 1, translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    this.Backdrop('classroom').stop();

    await this.Pause(1000);


    await this.Character('bebe').position('center').transition({ translateY: '-50%' }, 500, { loop: 3 }).name('Bebe?').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a', ' ']).classNames({ name: 'et-right' });
    await this.Character('bebe').initialExpression('bebe-panic').instance(1).transition({ translateX: '25%' });
    await this.Text('Bye!');
    await this.Character('bebe').Expression('bebe-blush');
    await this.Character('bebe').Text('How was that?');

    await this.Backdrop('classroom').transition('transition.whirlIn');
    this.Filter('theater.stage', ['blur(0px)', 'blur(10px)'], 1000);
    await this.Text('Hello!');
    this.Filter('theater.stage', ['blur(10px)', 'blur(0px)'], 1000).destroy();
    await this.Text('Bye!');

    const choice = await this.Choice(['A', 'B', 'C']);

    console.log(choice);

    this.Text('Hello!');
    await this.Pause(500);
    await this.Text('Bye!');

    this.SetData('foo', 'bar');
    console.log(await this.GetData('foo'));
    this.DeleteData('foo');
    console.log(await this.DeleteData('foo'));

    console.log('Entered Scene');

    await this.TransitionToScene('demo').transitionOut('transition.whirlOut', 1000);

    console.log('Left Scene');
  }
});
