export default {
  priority: 0,
  globals: {
    classNames: {
      decorative: ['et-paper'],
      structural: ['et-block']
    },
    transitionDuration: 200,
    transition: {
      duration: 500,
      effect: { opacity: 1 }
    },
    transitionIn: {
      effect: { opacity: 1 }
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
    },
    text: {
      namePosition: 'left',
      typeSpeed: 5,
      typeAnimation: {
        opacity: 0,
        translateX: '10px',
        translateY: '-5px'
      }
    },
    positions: {
      center: {
        translateX: '50%'
      },
      left: {
        translateX: '10%'
      },
      right: {
        translateX: '90%'
      }
    }
  }
};
