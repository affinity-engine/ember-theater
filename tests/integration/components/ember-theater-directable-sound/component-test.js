import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('ember-theater-directable-sound', 'Integration | Component | ember theater directable sound', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-theater-directable-sound}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-theater-directable-sound}}
      template block text
    {{/ember-theater-directable-sound}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
