import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.extend({
  script: async function() {
    await this.dialogue({ character: 'steven', intl: { id: '1.firstTest', options: { val1: 'my friend' } } });
    this.dialogue({ character: 'steven', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec purus diam. Duis condimentum sapien quis nisl dictum, et volutpat arcu mollis. Fusce nec nisl non eros lobortis fringilla. Aliquam ullamcorper eros efficitur rhoncus luctus. Phasellus odio velit, finibus a pharetra vel, accumsan id urna. Sed vitae egestas nisi. Nulla eu urna sed nulla pulvinar volutpat at quis nunc. Morbi vel purus est. Curabitur rutrum mauris a cursus tempus. Suspendisse leo eros, scelerisque porttitor leo a, vehicula facilisis quam. Mauris blandit tempor dolor a interdum. Curabitur rutrum arcu ac mi pharetra pellentesque. Nullam sodales gravida quam tempus lobortis. Mauris consequat mauris aliquam justo posuere convallis. Aliquam mauris est, lacinia condimentum tempus sit amet, cursus id lorem.' });
    await this.backdrop({ id: 'beach', options: { duration: 1000 } });
    this.backdrop({ id: 'beach', effect: { opacity: 0.5 }, options: { duration: 500 } });
    await this.character({ id: 'steven', effect: { translateX: '50vw', opacity: 1 }, options: { duration: 500 } });
    const choiceOne = await this.choice({ choices: { A: 'Whirl!', B: 'Jump!', C: 'Play Bolero!', D: 'Something', E: 'Filler', F: 'A really long statement, just becuase you know there will be users who have these too. Hell, you will probably create a few of these yourself. You know?', G: 'Here is another short statement.', H: 'Okay, that last one was still kind of long.', I: 'Really actually totally short.', J: 'Okay, really really short.', K: 'Truly short.', L: 'Short and sweet.', M: 'Shorter.', N: 'S' }});
    switch (choiceOne) {
      case 'A': await this.character({ id: 'steven', expression: { id: 'steven--jumping', transitionOut: { effect: 'transition.whirlOut', options: { duration: 1000 } }, transitionIn: { effect: 'transition.whirlIn', options: { duration: 1000 } } }}); break;
      case 'B': await this.character({ id: 'steven', effect: 'callout.bounce', options: { duration: 1000 } }); break;
      case 'C': this.sound({ id: 'song__bolero' }); break;
    }
    this.dialogue({ character: 'steven', text: 'How was that?!' });
  }
});
