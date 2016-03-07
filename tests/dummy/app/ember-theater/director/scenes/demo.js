import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  script: async function() {
    // const value = await this.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);
    //
    // console.log(value);

    // this.Sound('song__bolero').fadeIn();
    // await this.Pause(1000);
    // this.Sound('song__bolero').fadeOut();

    const bebe = await this.Character('bebe').position('center', 0).initialExpression('bebe-laughing').namePosition('left').name('Bebe Prime');
    const bebe2 = await this.Character('bebe').position('centerLeft', 0);

    await bebe.Text('Hello!')

    await bebe.namePosition('center').Text('Hello!')

    bebe.Expression('bebe-blush');
    bebe2.Expression('bebe-laughing');
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

    await this.Pause(600);

    bebe.stop();

    await this.Pause(1000);

    bebe.position('right').transition({ translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    bebe.stop();

    await this.Pause(1000);

    const classroom = this.Backdrop('classroom').transition({ opacity: 1 }, 500).transition({ translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    classroom.stop();

    await this.Pause(1000);

    classroom.transition({ opacity: 1, translateX: '30%' }, 1000, { loop: true });

    await this.Pause(600);

    classroom.stop();

    await this.Pause(1000);


    await bebe.position('center').transition({ translateY: '-50%' }, 500, { loop: 3 }).name('Bebe?').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a', ' ']).classNames({ name: 'et-right' });
    await this.Text('Bye!');
    await bebe.Expression('bebe-blush');
    await bebe.Text('How was that?');

    await classroom.transition('transition.whirlIn');
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
