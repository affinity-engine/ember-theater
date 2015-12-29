export default {
  priority: 100,
  globals: {
    decorativeClassNames: ['et-paper'],
    structuralClassNames: ['et-block'],
    textSpeed: 25,
    textStyle: {
      opacity: 0,
      translateX: '0.4vw',
      translateY: '-0.1vw'
    },
    transitionDuration: 200,
    transitionIn: {
      effect: { opacity: 0 }
    },
    transitionOut: {
      effect: { opacity: 0 }
    },
    keys: {
      accept: [' ', 'Enter'],
      cancel: ['Escape'],
      moveDown: ['ArrowDown', 's'],
      moveUp: ['ArrowUp', 'w']
    }
  },
  menuBar: {
    transitionIn: {
      effect: ['blur(0px)', 'blur(10px)'],
      duration: 500
    },
    transitionOut: {
      effect: ['blur(10px)', 'blur(0px)'],
      duration: 500
    },
    innerEffect: {
      effect: ['blur(10px)', 'blur(7px)', 'blur(10px)'],
      duration: 5000
    },
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
    scene: {
      transitionOut: {
        effect: { opacity: 0 },
        duration: 500
      }
    }
  }
};
