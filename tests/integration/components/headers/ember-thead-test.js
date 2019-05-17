import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { pauseTest } from '@ember/test-helpers';;
import { click } from 'ember-native-dom-helpers';

import TablePage from 'ember-table/test-support/pages/ember-table';

moduleForComponent('ember-thead', '[Unit] ember-thead', { integration: true });

test('underlying table resizes when columns are removed', async function (assert) {
    let columns = [
        { name: 'A', valuePath: 'A', width: 180 },
        { name: 'B', valuePath: 'B', width: 180 },
        { name: 'C', valuePath: 'C', width: 180 },
        { name: 'D', valuePath: 'D', width: 180 },
    ];

    let rows = [
        { A: 'A', B: 'B', C: 'C', D: 'D' },
        { A: 'A', B: 'B', C: 'C', D: 'D' },
        { A: 'A', B: 'B', C: 'C', D: 'D' },
    ];


    this.set('rows', rows);
    this.set('columns', columns);
    this.on('destroyLastColumn', function() {
      this.set('columns', this.get('columns').slice(0,-1));
    });

    await this.render(hbs`
    {{#ember-table data-test-ember-table=true as |t|}}
      {{#t.head 
        widthConstraint='eq-container'
        columns=columns as |h|}}
        {{#h.row as |r|}}
        {{r.cell}}
        {{/h.row}}
      {{/t.head}}

      {{#t.body rows=rows as |b|}}
        {{#b.row as |r|}}
        {{#r.cell as |cellValue|}}
            {{cellValue}}
        {{/r.cell}}
        {{/b.row}}
      {{/t.body}}
    {{/ember-table}}
    <button id="delete" {{action 'destroyLastColumn'}}>Remove Last Column</button>
    `);

    let page = new TablePage();

    await pauseTest();
    let originalWidth = page.width;
    let originalContainerWidth = page.containerWidth;

    await click('button#delete');

    let newWidth = page.width;
    let newContainerWidth = page.containerWidth;

    assert.equal(newWidth, originalWidth, 'columns were resized to fit table')
    assert.equal(newContainerWidth, originalContainerWidth, 'columns were resized to fit container')
    // page.header.headers
});