export default {
  priority: 0,
  globals: {
    classNames: {
      decorative: ['et-paper'],
      structural: ['et-wide']
    },
    textSpeed: 25,
    textAnimation: {
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
    resize: {
      keys: {
        open: ['F11']
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
