export default {
  priority: 0,
  globals: {
    classNames: ['et-paper', 'et-block'],
    transitionDuration: 200,
    transition: {
      duration: 250,
      effect: { opacity: 1 }
    },
    transitionIn: {
      duration: 250,
      effect: { opacity: [1, 0] }
    },
    transitionOut: {
      duration: 250,
      effect: { opacity: 0 }
    },
    keys: {
      accept: [' ', 'Enter'],
      cancel: ['Escape'],
      moveDown: ['ArrowDown', 's'],
      moveUp: ['ArrowUp', 'w']
    }
  },
  saveStateManager: {
    maxStatePoints: false
  },
  autosaveManager: {
    maxAutosaves: 3
  }
};
