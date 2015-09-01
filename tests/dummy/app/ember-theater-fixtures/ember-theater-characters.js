export default {
  data: [{
    type: 'ember-theater-character',
    id: 'steven',
    attributes: {
      name: 'Steven',
      height: 60
    },
    relationships: {
      defaultExpression: {
        data: { type: 'ember-theater-character-expression', id: 'steven' }
      }
    }
  }]
};
