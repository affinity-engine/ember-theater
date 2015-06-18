import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-theater', 'Unit | Component | ember theater', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: [
    'model:ember-theater-backdrop', 'model:ember-theater-character-portrait',
    'component:ember-theater-curtain', 'component:ember-theater-stage'
  ]
});
