export default {
  globals: {
    classNames: ['et-wide', 'et-coastal'],
    speed: 300,
    transitionDuration: 200,
    keys: {
      accept: [' ', 'Enter'],
      cancel: ['Escape'],
      loadMenu: ['ctrl+l'],
      moveDown: ['ArrowDown', 's'],
      moveUp: ['ArrowUp', 'w'],
      resetMenu: ['ctrl+r'],
      rewindMenu: ['ctrl+b'],
      saveMenu: ['ctrl+s']
    }
  },
  menu: {
    transitionIn: ['blur(0px)', 'blur(10px)'],
    transitionInDuration: 500,
    transitionOut: ['blur(10px)', 'blur(0px)'],
    transitionOutDuration: 500,
    innerEffect: ['blur(10px)', 'blur(7px)', 'blur(10px)'],
    innerEffectDuration: 5000
  },
  speed: {
    sceneTransition: 750
  }
};
