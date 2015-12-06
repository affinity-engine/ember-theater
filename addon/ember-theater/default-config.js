export default {
  globals: {
    decorativeClassNames: ['et-paper'],
    structuralClassNames: ['et-block'],
    speed: 300,
    transitionDuration: 200,
    transitionInDuration: 150,
    keys: {
      accept: [' ', 'Enter'],
      cancel: ['Escape'],
      moveDown: ['ArrowDown', 's'],
      moveUp: ['ArrowUp', 'w']
    }
  },
  menuBar: {
    transitionIn: ['blur(0px)', 'blur(10px)'],
    transitionInDuration: 500,
    transitionOut: ['blur(10px)', 'blur(0px)'],
    transitionOutDuration: 500,
    innerEffect: ['blur(10px)', 'blur(7px)', 'blur(10px)'],
    innerEffectDuration: 5000,
    load: {
      keys: {
        open: ['ctrl+l']
      }
    },
    reset: {
      keys: {
        open: ['ctrl+r']
      }
    },
    rewind: {
      keys: {
        open: ['ctrl+b']
      }
    },
    save: {
      keys: {
        open: ['ctrl+s']
      }
    }
  },
  director: {
    transitionDuration: 500
  }
};
